import SnuOwnd from 'snuownd';

const markdown = SnuOwnd.getParser();

// Fetches JSON at the given url or throws a descriptive Error
export const fetchJson = <T>(url: string, init: RequestInit = {}): Promise<T> => 
    fetchJsonAndHeaders<T>(url, init).then(response => response.json);
  
// Fetches JSON, returning an object with a .json and a .headers member
export const fetchJsonAndHeaders = async <T>(url: string, init: RequestInit = {}): Promise<{ json: T, headers: Headers }> => {
    const response = await window.fetch(url, init);
    if (!response.ok) {
      const text = await response.text().catch(error => {
        throw new Error((response.statusText || response.status) + ', ' + error);
      });
      console.error((response.statusText || response.status) + ': ' + text);
      throw new Error((response.statusText || response.status) + ': ' + text);
    }
  
    const text = await response.text();
    return {
      json: JSON.parse(text) as T,
      headers: response.headers
    };
  };

export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

// Reddits way of indicating that something is deleted (the '\\' is for Reddit and the other is for pushshift)
export const isDeleted = (textBody: string): boolean => 
  textBody === '\\[deleted\\]' || textBody === '[deleted]';

// Reddits way of indicating that something is deleted
export const isRemoved = (textBody: string): boolean => 
  textBody === '\\[removed\\]' || textBody === '[removed]' || textBody === '[ Removed by Reddit ]';

// Default thumbnails for reddit threads
export const redditThumbnails: string[] = ['self', 'default', 'image', 'nsfw', 'spoiler'];

// Parse comments (see https://www.reddit.com/dev/api/#response_body_encoding)
export const parse = (text: string): string => 
  markdown.render(text.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&'));

// UTC to "Reddit time format" (e.g. 5 hours ago, just now, etc...)
export const prettyDate = (createdUTC: number): string => {
  const currentUTC = Math.floor((new Date()).getTime() / 1000);

  const secondDiff = currentUTC - createdUTC;
  if (secondDiff < 86400) {
    if (secondDiff < 10) return 'just now';
    if (secondDiff < 60) return `${secondDiff} seconds ago`;
    if (secondDiff < 120) return 'a minute ago';
    if (secondDiff < 3600) return `${Math.floor(secondDiff / 60)} minutes ago`;
    if (secondDiff < 7200) return 'an hour ago';
    return `${Math.floor(secondDiff / 3600)} hours ago`;
  }

  const dayDiff = Math.floor(secondDiff / 86400);
  if (dayDiff < 2) return '1 day ago';
  if (dayDiff < 7) return `${dayDiff} days ago`;
  if (dayDiff < 14) return '1 week ago';
  if (dayDiff < 31) return `${Math.floor(dayDiff / 7)} weeks ago`;
  if (dayDiff < 60) return '1 month ago';
  if (dayDiff < 365) return `${Math.floor(dayDiff / 30)} months ago`;
  if (dayDiff < 730) return '1 year ago';
  return `${Math.floor(dayDiff / 365)} years ago`;
};

// The date and time, to the second, formatted in the user's locale
export const exactDateTime = (utc: number): string => {
  const datetime = new Date(utc * 1000);
  if (new Date().toDateString() == datetime.toDateString())
    return datetime.toLocaleTimeString([], { timeStyle: 'long' });
  else
    return datetime.toLocaleString([], { dateStyle: 'medium', timeStyle: 'long' });
};

// Time difference in seconds to text, rounded up by default (e.g. x seconds/minutes/hours)
export const prettyTimeDiff = (secondDiff: number, roundDown = false): string => {
  if (secondDiff < 2) return `1 second`;
  if (secondDiff < 120) return `${secondDiff} seconds`;
  const round = roundDown ? Math.floor : Math.ceil;
  if (secondDiff < 7200) return `${round(secondDiff / 60)} minutes`;
  if (secondDiff < 172800) return `${round(secondDiff / 3600)} hours`;
  const days = round(secondDiff / 86400);
  if (days < 10 && roundDown) return `${days} days, ${round((secondDiff - days * 86400) / 3600)} hours`;
  return `${days} days`;
};

// Reddit format for scores, e.g. 12000 => 12k
export const prettyScore = (score: number): string | number => {
  if (score >= 100000) {
    return `${(score / 1000).toFixed(0)}k`;
  } else if (score >= 10000) {
    return `${(score / 1000).toFixed(1)}k`;
  }

  return score;
};

// Retrieve, store and delete stuff in the local storage
export const get = <T>(key: string, defaultValue: T): T => {
    const value = window.localStorage.getItem(key);
    return value !== null ? JSON.parse(value) as T : defaultValue;
  };
  
export const put = <T>(key: string, value: T): void => 
    window.localStorage.setItem(key, JSON.stringify(value));

// Sorting for comments
export const topSort = (commentA: { score: number }, commentB: { score: number }): number => 
  commentB.score - commentA.score;

export const bottomSort = (commentA: { score: number }, commentB: { score: number }): number => 
  commentA.score - commentB.score;

export const newSort = (commentA: { created_utc: number }, commentB: { created_utc: number }): number => 
  commentB.created_utc - commentA.created_utc;

export const oldSort = (commentA: { created_utc: number }, commentB: { created_utc: number }): number => 
  commentA.created_utc - commentB.created_utc;

// Filter comments
export const showRemoved = (comment: { removed: boolean }): boolean => 
  comment.removed === true;

export const showDeleted = (comment: { deleted: boolean }): boolean => 
  comment.deleted === true;

export const showRemovedAndDeleted = (comment: { removed: boolean, deleted: boolean }): boolean => 
  comment.removed === true || comment.deleted === true;

// Edited text display modes
export const editedModes = {
  dfault: 0,  // diff mode if it's been edited, otherwise same as orig
  orig: 1,
  edited: 2,
  length: 3
};

export const editedTitles: string[] = [
  'Edits are highlighted; click to change',
  'The first archived edit is shown; click to change',
  'The most recent edit is shown; click to change'
];