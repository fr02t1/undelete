import React from 'react';
import { Subscribe, Container } from 'unstated';
import { get, put } from './utils';
import { chunkSize } from './api/pushshift';

// Sort types for comments
export const sort = {
  top: 'SORT_TOP',
  bottom: 'SORT_BOTTOM',
  new: 'SORT_NEW',
  old: 'SORT_OLD',
} as const;

// Filter types for comments
export const filter = {
  all: 'SHOW_ALL',
  removedDeleted: 'SHOW_REMOVED_DELETED',
  removed: 'SHOW_REMOVED',
  deleted: 'SHOW_DELETED',
} as const;

// Light/Dark mode themes
export const theme = {
  dark: 'DARK',
  light: 'LIGHT',
  system: 'SYSTEM',
} as const;

export const maxCommentsDefault = chunkSize * 4;
export const minCommentsLimit = chunkSize;
export const maxCommentsLimit = 20000;

// Constrains input to between minCommentsLimit and maxCommentsLimit
export const constrainMaxComments = (maxComments: number): number => {
  maxComments = Math.min(Math.round(maxComments), maxCommentsLimit);
  if (!(maxComments >= minCommentsLimit))  // also true when maxComments isn't a number
    maxComments = minCommentsLimit;
  return maxComments;
};

// Keys for localStorage
const sortKey = 'commentSort';
const filterKey = 'commentFilter';
const maxCommentsKey = 'maxComments';
const themeKey = 'theme';

document.documentElement.dataset.theme = get(themeKey, theme.dark);
setTimeout(() => (document.documentElement.style.transitionDuration = '0.4s'), 0);

interface GlobalStateType {
  commentSort: string;
  commentFilter: string;
  loadingMoreComments: number;
  statusText: string;
  statusHelpUrl?: string;
  statusImage?: string;
}

// Define the type for the props
export interface WithGlobalProps {
  global: GlobalState;
}

export class GlobalState extends Container<GlobalStateType> {
  state: GlobalStateType = {
    commentSort: get(sortKey, sort.top),
    commentFilter: get(filterKey, filter.removedDeleted),
    loadingMoreComments: 0,  // max # of comments to attempt to load next
    statusText: '',
    statusHelpUrl: undefined,
    statusImage: undefined,
  };

  // Preferred max # of comments to get during (re-)loads
  maxComments: number = get(maxCommentsKey, maxCommentsDefault);

  curTheme: string = document.documentElement.dataset.theme || theme.dark;

  setCommentSort(sortType: string) {
    put(sortKey, sortType);
    this.setState({ commentSort: sortType });
  }

  setCommentFilter(filterType: string) {
    put(filterKey, filterType);
    this.setState({ commentFilter: filterType });
  }

  // Constrains, saves, and returns it (does not load more comments)
  setMaxComments(maxComments: number): number {
    this.maxComments = constrainMaxComments(maxComments);
    put(maxCommentsKey, this.maxComments);
    return this.maxComments;
  }

  // Loads more comments
  loadMoreComments = (loadingMoreComments: number) => this.setState({ loadingMoreComments });

  setTheme(newTheme: string) {
    put(themeKey, newTheme);
    this.curTheme = newTheme;
    document.documentElement.dataset.theme = newTheme;
  }

  setSuccess = () => {
    this.setState({
      statusText: '',
      statusHelpUrl: undefined,
      statusImage: '/images/success.png',
    });
    document.body.classList.remove('wait');
  };

  setLoading = (text: string) => {
    this.setState({
      statusText: text,
      statusImage: '/images/loading.gif',
    });
    document.body.classList.add('wait');
  };

  setError = (error: Error, helpUrl?: string) => {
    this.setState({
      statusText: error.message,
      statusImage: '/images/error.png',
      statusHelpUrl: helpUrl,
    });
    document.body.classList.remove('wait');
  };

  clearStatus = () => {
    this.setState({
      statusText: '',
      statusHelpUrl: undefined,
      statusImage: undefined,
    });
    document.body.classList.remove('wait');
  };

  isErrored = (): boolean => this.state.statusImage?.endsWith('error.png') || false;
}

// A redux-like connect function for Unstated
export const connect = <P extends object>(Component: React.ComponentType<P & WithGlobalProps>) => {
  return function Connected(props: P) {
    return (
      <Subscribe to={[GlobalState]}>
        {(globalState: GlobalState) => <Component {...props} global={globalState} />}
      </Subscribe>
    );
  };
};