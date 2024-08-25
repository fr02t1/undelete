import React from 'react';

interface CommentInfoProps {
  removed: number;
  deleted: number;
  total: number;
}

const getProcent = (part: number, total: number): string => (total === 0 ? '0.0' : ((100 * part) / total).toFixed(1));

export default function CommentInfo(props: CommentInfoProps) {
  return (
    <div id='comment-info'>
      <span className='nowrap removed-text'>
        removed comments: {props.removed}/{props.total} ({getProcent(props.removed, props.total)}%)
      </span>
      <span className='nowrap deleted-text'>
        deleted comments: {props.deleted}/{props.total} ({getProcent(props.deleted, props.total)}%)
      </span>
    </div>
  );
}