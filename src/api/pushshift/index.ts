import { fetchJson } from '../../utils';
import { errorHandler, toBase36 } from './utils';
import { 
    Post, 
    FetchJsonResponse, 
    Comment,  
    FetchJsonResponseWithMetadata, 
    Callback 
  } from './types';
import { TokenBucket } from './TokenBucket';

export const chunkSize = 100;
const postURL = 'https://api.pullpush.io/reddit/submission/search/?fields=author,created_utc,domain,edited,id,link_flair_text,num_comments,permalink,position,removed_by_category,retrieved_on,retrieved_utc,score,selftext,subreddit,thumbnail,thumbnail_height,thumbnail_width,title,url&ids=';
const commentURL = 'https://api.pullpush.io/reddit/comment/search/?fields=author,body,created_utc,id,link_id,parent_id,retrieved_on,retrieved_utc,score,subreddit&';
const commentURLbyIDs = `${commentURL}ids=`;
const commentURLbyLink = `${commentURL}metadata=true&size=${chunkSize}&sort=asc&link_id=`;


const pushshiftTokenBucket = new TokenBucket(2015, 7);

export const getPost = async (threadID: string): Promise<Post | null> => {
    await pushshiftTokenBucket.waitForToken();
    try {
      const { data }: FetchJsonResponse<Post[]> = await fetchJson(`${postURL}${threadID}`);
      const firstPost = data[0]; // get the first post (newest post)
      const secondPost = data.length > 1 ? data[1] : null; // check if there is a second post (oldest post)
      return (firstPost.selftext === '[deleted]' || firstPost.selftext === '[removed]') ? secondPost : firstPost;
    } catch (error) {
        if (error instanceof Error) {
          errorHandler('Could not get removed/edited post', error, 'pushshift.getPost');
        } else {
          errorHandler('Could not get removed/edited post', new Error('Unknown error'), 'pushshift.getPost');
        }
        return null; // Ensure the function always returns a value
    }
};
  
export const getCommentsFromIds = async (commentIDs: string[]): Promise<Comment[]> => {
    if (commentIDs.length === 0) return [];
    let response: FetchJsonResponse<Comment[]>, delay = 0;
    while (true) {
      await pushshiftTokenBucket.waitForToken();
      try {
        response = await fetchJson(`${commentURLbyIDs}${commentIDs.join()}`);
        break;
      } catch (error) {
        if (delay >= 2000) {  // after ~4s of consecutive failures
          if (error instanceof Error) {
            errorHandler('Could not get removed comments', error, 'pushshift.getCommentsFromIds');  // rethrows
          } else {
            errorHandler('Could not get removed comments', new Error('Unknown error'), 'pushshift.getCommentsFromIds');  // rethrows
          }
        }
        delay = delay * 2 || 125;
        pushshiftTokenBucket.setNextAvail(delay);
        console.log('pushshift.getCommentsFromIds delay: ' + delay);
      }
    }
  
    const comments = response.data;
    const commentMap = new Map<string, Comment>();
  
    comments.forEach(c => {
      const existingComment = commentMap.get(c.id);
      if (!existingComment ||
        (existingComment.body === '[deleted]' && c.body !== '[deleted]') ||
        (existingComment.body === '[removed]' && c.body !== '[removed]')) {
        commentMap.set(c.id, c);
      }
    });
  
    return Array.from(commentMap.values()).map(c => {
      c.link_id = toBase36(c.link_id) as string;
      c.parent_id = toBase36(c.parent_id) as string || c.link_id;
      return c;
    });
};
export const getComments = async (
  callback: Callback,
  threadID: string,
  maxComments: number,
  after = 0,
  before?: number
): Promise<[number, boolean]> => {
  let chunks = Math.floor(maxComments / chunkSize), response: FetchJsonResponseWithMetadata<Comment[]>, lastCreatedUtc = 1;
  const commentMap = new Map<string, Comment>();

  while (true) {
    let query = commentURLbyLink + threadID;
    if (after) query += `&after=${after}`;
    if (before) query += `&before=${before}`;
    let delay = 0;

    while (true) {
      await pushshiftTokenBucket.waitForToken();
      try {
        response = await fetchJson(query);
        break;
      } catch (error) {
        if (delay >= 8000) {  // after ~16s of consecutive failures
          if (error instanceof Error) {
            errorHandler('Could not get removed comments', error, 'pushshift.getComments');  // rethrows
          } else {
            errorHandler('Could not get removed comments', new Error('Unknown error'), 'pushshift.getComments');  // rethrows
          }
        }
        delay = delay * 2 || 125;
        pushshiftTokenBucket.setNextAvail(delay);
        if (!callback([])) return [lastCreatedUtc, false];
        console.log('pushshift.getComments delay: ' + delay);
      }
    }

    const comments = response.data;

    // Add comments to the map, replacing deleted/removed ones if necessary
    comments.forEach(c => {
      const existingComment = commentMap.get(c.id);
      if (!existingComment ||
        (existingComment.body === '[deleted]' && c.body !== '[deleted]') ||
        (existingComment.body === '[removed]' && c.body !== '[removed]')) {
        commentMap.set(c.id, c);
      }
    });

    const loadedAllComments = response.metadata.total_results !== undefined ?
      response.metadata.results_returned >= response.metadata.total_results :
      comments.length < chunkSize / 2;

    if (comments.length) lastCreatedUtc = comments[comments.length - 1].created_utc;
    if (loadedAllComments || chunks <= 1) break;
    chunks--;
    after = Math.max(lastCreatedUtc - 1, after + 1);
  }

  const allComments = Array.from(commentMap.values());

  const exitEarly = !callback(allComments.map(c => ({
    ...c,
    parent_id: c.parent_id ? toBase36(c.parent_id) as string : threadID,
    link_id: c.link_id?.substring(3) || threadID
  })));

  return [lastCreatedUtc, !exitEarly];
}