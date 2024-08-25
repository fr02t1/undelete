// types.ts
export interface PostProps {
    title?: string;
    subreddit: string;
    id: string;
    removed?: boolean;
    isLocFullPost?: boolean;
    url: string;
    author?: string;
    thumbnail?: string;
    thumbnail_width?: number;
    thumbnail_height?: number;
    selftext?: string;
    is_self?: boolean;
    edited_selftext?: string;
    retrieved_utc?: number;
    retrieved_on?: number;
    created_utc: number;
    edited?: number;
    score: number;
    permalink: string;
    num_comments: number;
    link_flair_text?: string;
    domain: string;
    position?: number;
    deleted?: boolean;
  }