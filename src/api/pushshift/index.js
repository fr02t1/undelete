import { fetchJson, sleep } from "../../utils";

export const chunkSize = 100;
const postURL =
  "https://api.pullpush.io/reddit/submission/search/?fields=author,created_utc,domain,edited,id,link_flair_text,num_comments,permalink,position,removed_by_category,retrieved_on,retrieved_utc,score,selftext,subreddit,thumbnail,thumbnail_height,thumbnail_width,title,url&ids=";
const commentURL =
  "https://api.pullpush.io/reddit/comment/search/?fields=author,body,created_utc,id,link_id,parent_id,retrieved_on,retrieved_utc,score,subreddit&";
const commentURLbyIDs = `${commentURL}ids=`;
const commentURLbyLink = `${commentURL}metadata=true&size=${chunkSize}&sort=asc&link_id=`;

const errorHandler = (msg, origError, from) => {
  console.error(from + ": " + origError);
  const error = new Error(msg);
  if (origError.name == "TypeError")
    // Usually indicates that Pushshift is down
    error.helpUrl = "/about#psdown";
  throw error;
};

function processComments(comments, commentMap) {
  comments.forEach((c) => {
    const existingComment = commentMap.get(c.id);
    if (
      !existingComment ||
      existingComment.body === "[deleted]" ||
      existingComment.body === "[removed]"
    ) {
      commentMap.set(c.id, c);
    }
  });
}

class TokenBucket {
  // Refills tokens at a rate of one per msRefillIntvl millis, storing up to size tokens.
  constructor(msRefillIntvl, size) {
    if (!(msRefillIntvl > 0)) throw RangeError("msRefillIntvl must be > 0");
    if (!(size > 0)) throw RangeError("size must be > 0");
    this._msRefillIntvl = msRefillIntvl;
    this._maxSize = size;
    this._tokens = size;
    // Invariant: this._msNextRefill is valid iff this._tokens < this._maxSize
  }

  // Removes one token, waiting for it to refill if none are available.
  async waitForToken() {
    let msNow;
    // Calculate if/how many tokens to refill
    if (this._tokens < this._maxSize) {
      // this._msNextRefill is valid
      msNow = Date.now();
      if (msNow >= this._msNextRefill) {
        const newTokens =
          Math.floor((msNow - this._msNextRefill) / this._msRefillIntvl) + 1;
        this._tokens += newTokens;
        if (this._tokens < this._maxSize)
          this._msNextRefill += newTokens * this._msRefillIntvl;
        else this._tokens = this._maxSize; // this._msNextRefill is now invalid
      }
    }
    // Remove a token or wait for _msNextRefill, and recalculate it
    if (this._tokens > 0) {
      if (this._tokens == this._maxSize)
        // this._msNextRefill is invalid,
        this._msNextRefill = (msNow || Date.now()) + this._msRefillIntvl; // make it valid
      this._tokens--;
    } else {
      // this._msNextRefill is valid and msNow has already been set above
      await sleep(this._msNextRefill - msNow);
      this._msNextRefill += this._msRefillIntvl;
    }
  }

  // Removes all tokens, and will refill the next token msNextAvail
  // millis from now. After it's refilled, resumes normal refill rate.
  setNextAvail(msNextAvail) {
    this._tokens = 0;
    this._msNextRefill = Date.now() + msNextAvail;
  }
}

const pushshiftTokenBucket = new TokenBucket(2015, 7);

export const getPost = async (threadID) => {
  await pushshiftTokenBucket.waitForToken();
  try {
    const { data } = await fetchJson(`${postURL}${threadID}`);
    const firstPost = data[0]; // get the first post (newest post)
    const secondPost = data.length > 1 ? data[1] : null; // check if there is a second post (oldest post)
    return firstPost.selftext === "[deleted]" ||
      firstPost.selftext === "[removed]"
      ? secondPost
      : firstPost;
  } catch (error) {
    errorHandler(
      "Could not get removed/edited post",
      error,
      "pushshift.getPost",
    );
  }
};

// Starting sometime around May/6/2022, queries using the `ids` parameter
// started returning decimal IDs for the `_id` members instead of fullnames.
const toBase36 = (id) => {
  if (!id) return id;
  if (typeof id == "number") return id.toString(36);
  else return id[2] == "_" ? id.substring(3) : id;
};

export const getCommentsFromIds = async (commentIDs) => {
  if (commentIDs.length == 0) return [];
  let response,
    delay = 0;
  while (true) {
    await pushshiftTokenBucket.waitForToken();
    try {
      response = await fetchJson(`${commentURLbyIDs}${commentIDs.join()}`);
      break;
    } catch (error) {
      if (delay >= 2000)
        // after ~4s of consecutive failures
        errorHandler(
          "Could not get removed comments",
          error,
          "pushshift.getCommentsFromIds",
        ); // rethrows
      delay = delay * 2 || 125;
      pushshiftTokenBucket.setNextAvail(delay);
      console.log("pushshift.getCommentsFromIds delay: " + delay);
    }
  }

  const comments = response.data;
  const commentMap = new Map();
  processComments(comments, commentMap);

  return Array.from(commentMap.values()).map((c) => {
    c.link_id = toBase36(c.link_id);
    c.parent_id = toBase36(c.parent_id) || c.link_id;
    return c;
  });
};

// The callback() function is called with an Array of comments after each chunk is
// retrieved. It should return as quickly as possible (scheduling time-taking work
// later), and may return false to cause getComments to exit early, or true otherwise.
export const getComments = async (
  callback,
  threadID,
  maxComments,
  after = 0,
  before = undefined,
) => {
  let chunks = Math.floor(maxComments / chunkSize),
    response,
    lastCreatedUtc = 1;
  const commentMap = new Map();

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
        if (delay >= 8000) {
          // after ~16s of consecutive failures
          errorHandler(
            "Could not get removed comments",
            error,
            "pushshift.getComments",
          ); // rethrows
        }
        delay = delay * 2 || 125;
        pushshiftTokenBucket.setNextAvail(delay);
        if (!callback([])) return [lastCreatedUtc, false];
        console.log("pushshift.getComments delay: " + delay);
      }
    }

    const comments = response.data;

    // Add comments to the map, replacing deleted/removed ones if necessary
    processComments(comments, commentMap);

    const loadedAllComments = Object.prototype.hasOwnProperty.call(
      response.metadata,
      "total_results",
    )
      ? response.metadata.results_returned >= response.metadata.total_results
      : comments.length < chunkSize / 2;

    if (comments.length)
      lastCreatedUtc = comments[comments.length - 1].created_utc;
    if (loadedAllComments || chunks <= 1) break;
    chunks--;
    after = Math.max(lastCreatedUtc - 1, after + 1);
  }

  const allComments = Array.from(commentMap.values());

  const exitEarly = !callback(
    allComments.map((c) => ({
      ...c,
      parent_id: c.parent_id ? toBase36(c.parent_id) : threadID,
      link_id: c.link_id?.substring(3) || threadID,
    })),
  );

  return [lastCreatedUtc, !exitEarly];
};
