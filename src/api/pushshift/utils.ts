import { ErrorWithHelpUrl } from './types';

export const errorHandler = (msg: string, origError: Error, from: string): never => {
  console.error(from + ': ' + origError);
  const error: ErrorWithHelpUrl = new Error(msg);
  if (origError.name === 'TypeError') {  // Usually indicates that Pushshift is down
    error.helpUrl = '/about#psdown';
  }
  throw error;
};

export const toBase36 = (id: string | number): string | number => {
  if (!id) return id;
  if (typeof id === 'number') return id.toString(36);
  return id[2] === '_' ? id.substring(3) : id;
};