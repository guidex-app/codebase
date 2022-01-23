import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Star } from 'react-feather';
import { getFireDocument, setNewRating } from '../../data/fire';
import { User } from '../../interfaces/user';
import FormButton from '../form/basicButton';
import BasicInput from '../form/basicInput';
import style from './style.module.css';

interface AddRatingProps {
  user: User;
  activityId: string;
  type: 'rating' | 'tipps';
  close: () => void;
}

const AddRating: FunctionalComponent<AddRatingProps> = ({ user, activityId, type, close }: AddRatingProps) => {
  const [ownComment, setOwnComment] = useState<{ comment: string, capture: string, oldRating?: number, rating?:number }>({
    comment: '',
    capture: '',
    oldRating: 0,
    rating: 0,
  });

  const changeValue = async (value: any, key:string) => {
    setOwnComment({ ...ownComment, [key]: value });
  };

  const commitRating = () => {
    if (user.uid) {
      const ratingComment = {
        comment: ownComment.comment,
        capture: ownComment.capture,
        vote: 0,
        displayName: user.displayName,
        uid: user.uid,
        ...(type === 'rating' && { rating: ownComment.rating || 0 }),
      };

      setNewRating(activityId, user.uid, ratingComment, type, ownComment.oldRating).then(() => close());
    }
  };

  useEffect(() => {
    if (activityId && user.uid) {
      getFireDocument(`activities/${activityId}/${type}/${user.uid}`).then((data: { comment: string, capture: string, oldRating?: number, rating?:number }) => data && setOwnComment({
        comment: data.comment,
        capture: data.capture,
        ...(data.rating && { oldRating: data.rating, rating: data.rating }),
      }));
    }
  }, [activityId]);

  return (
    <div style={{ padding: '0 10px' }}>
      {type === 'rating' && (
        <div class={style.rate}>
          {[1, 2, 3, 4, 5].map((starNum: number) => {
            if (ownComment.rating && starNum <= ownComment.rating && ownComment.rating !== 0) {
              return (
                <button key={starNum} type="button" onClick={() => changeValue(starNum, 'rating')}>
                  <Star fill="#ffab00" />
                </button>
              );
            }

            if (starNum - 0.5 === ownComment.rating) {
              return (
                <button type="button" key={starNum - 0.5} onClick={() => changeValue(starNum - 0.5, 'rating')}>
                  <Star fill="#ffab00" />
                </button>
              );
            }

            return (
              <button type="button" key={starNum} onClick={() => changeValue(starNum, 'rating')}>
                <Star />
              </button>
            );
          })}
        </div>
      )}

      <BasicInput
        type="text"
        label="Titel (optional)"
        name="capture"
        value={ownComment.capture}
        placeholder="Gebe einen Titel an"
        // error={fieldErrors.capture}
        change={changeValue}
      />

      <BasicInput
        type="textarea"
        label={`Dein ${type === 'rating' ? 'Bewertung (optional)' : 'Tipp'}`}
        name="comment"
        value={ownComment.comment}
        placeholder="Beschreibe dein Statement"
        // error={fieldErrors.comment}
        change={changeValue}
      />

      <FormButton disabled={!user.uid} label={`${type === 'rating' ? 'Bewertung' : 'Tipp'} abschicken`} action={() => commitRating()} />

      {ownComment.oldRating && <p class="red">Mit einer neuen Bewertung, werden alle Votes auf 0 zurückgesetzt</p>}
      <p class="grey">Hilf anderen und neuen Besuchern und gebe Ihnen mit deiner Bewertung eine Bewertungsgrundlage. Beschreibe dein Erlebnis in Worten und beschreibe was dich zu deiner Bewertung führt.</p>
    </div>
  );
};

export default AddRating;
