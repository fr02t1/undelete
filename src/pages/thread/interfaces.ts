import { GlobalState, WithGlobalProps } from "../../state";

export interface Comment {
  id: string;
  parent_id?: string;
  link_id?: string;
  body?: string;
  removed?: boolean;
  deleted?: boolean;
}

export interface Contig {
  firstCreated: number;
  lastCreated: number;
}

export interface ThreadProps extends WithGlobalProps {
    match: {
        params: {
          subreddit: string;
          threadID: string;
          commentID?: string;
        };
      };
      location: {
        search: string;
        hash: string;
        state?: {
          scrollBehavior?: string;
        };
      };
      global: GlobalState;
}

export interface ThreadState {
  post: Record<string, any>;
  pushshiftCommentLookup: Map<string, Comment>;
  removed: number;
  deleted: number;
  context: number;
  moreContextAvail: boolean;
  allCommentsFiltered: boolean;
  loadedAllComments: boolean;
  loadingComments: boolean;
  reloadingComments: boolean;
}
