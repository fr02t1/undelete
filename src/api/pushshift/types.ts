export interface ErrorWithHelpUrl extends Error {
    helpUrl?: string;
  }
  
  export interface Post {
    selftext: string;
  }
  
  export interface FetchJsonResponse<T> {
    data: T;
  }
  
  export interface Comment {
    id: string;
    body: string;
    link_id: string;
    parent_id: string;
    created_utc: number;
  }
  
  export interface Metadata {
    total_results?: number;
    results_returned: number;
  }
  
  export interface FetchJsonResponseWithMetadata<T> {
    data: T;
    metadata: Metadata;
  }
  
  export type Callback = (comments: Comment[]) => boolean;