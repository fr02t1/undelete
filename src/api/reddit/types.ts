// types.ts

export interface FetchInit {
    headers: {
      Authorization: string;
      'Accept-Language'?: string;
    };
  }
  
  export interface RedditResponse {
    headers: Headers;
    json: unknown;
  }
  
  export interface ThreadData {
    data: Record<string, unknown>;
  }
  
  export interface Thread {
    data: {
      children: Array<{ data: ThreadData }>;
    };
  }