import { FunctionalComponent, h } from 'preact';
import { ChevronDown, ChevronUp } from 'react-feather';

import { RatingComment } from '../../../interfaces/rating';
import style from './style.module.css';

interface UserCommentItemProps {
  rate: RatingComment;
  vote: (uid: string, type: 'add' | 'remove', vote: number) => void;
}

const UserCommentItem: FunctionalComponent<UserCommentItemProps> = ({ rate, vote }: UserCommentItemProps) => (
  <div class={style.comment}>
    <div class={style.image}>
      +
    </div>
    <div>
      <small>
        <span style={{ color: 'var(--fifth)' }}>{rate.displayName} &nbsp;</span>
        {rate.rating && [1, 2, 3, 4, 5].map((x) => (
          <span key={`${rate.displayName}_${x}`} style={{ color: 'var(--orange)' }}>{x <= (rate.rating || 0) ? '★' : '☆'}</span>
        ))}
      </small>
      <br />
      <h4><strong>{rate.capture}</strong></h4>
      <p style={{ color: 'var(--fifth)' }}>{rate.comment}</p>

      <div class={style.upvote}>
        <button type="button" disabled={rate.vote === 1} onClick={() => vote(rate.uid, 'add', rate.vote)}>
          <ChevronUp />
        </button>
        <strong>{rate.vote}</strong>
        <button type="button" disabled={rate.vote === -1} onClick={() => vote(rate.uid, 'remove', rate.vote)}>
          <ChevronDown />
        </button>
      </div>
    </div>
  </div>
);

export default UserCommentItem;
