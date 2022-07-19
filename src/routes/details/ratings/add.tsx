import { IconStar } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { getFireDocument, setNewRating } from '../../../data/fire';
import { User } from '../../../interfaces/user';
import FormButton from '../../../components/form/basicButton';
import NormalInput from '../../../components/form/Inputs/basic';
import TextInput from '../../../components/form/Inputs/textArea';
import style from './style.module.css';

interface AddRatingProps {
  user: User;
  activityId: string;
  rating: number;
  type: 'rating' | 'tipps';
  close: () => void;
}

const AddRating: FunctionalComponent<AddRatingProps> = ({ user, activityId, rating, type, close }: AddRatingProps) => {
  const [ownComment, setOwnComment] = useState<{ comment: string, capture: string, oldRating?: number, rating?:number }>({
    comment: '',
    capture: '',
    oldRating: 0,
    rating,
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

  // if (ownComment.rating && starNum <= ownComment.rating && ownComment.rating !== 0) {
  //   return (
  //     <button key={starNum} type="button" onClick={() => changeValue(starNum, 'rating')}>
  //       <Star fill="var(--orange)" />
  //     </button>
  //   );
  // }

  // if (starNum - 0.5 === ownComment.rating) {
  //   return (
  //     <button type="button" key={starNum - 0.5} onClick={() => changeValue(starNum - 0.5, 'rating')}>
  //       <Star fill="var(--orange)" />
  //     </button>
  //   );
  // }

  // return (
  //   <button type="button" key={starNum} onClick={() => changeValue(starNum, 'rating')}>
  //     <Star />
  //   </button>
  // );

  return (
    <Fragment>
      {type === 'rating' && (
        <div class={style.rate}>
          {[1, 2, 3, 4, 5].map((starNum: number) => (
            <button key={starNum} type="button" onClick={() => changeValue(starNum, 'rating')}>
              <IconStar fill={(starNum <= (ownComment.rating || 0) || starNum - 0.5 === ownComment.rating) ? 'var(--orange)' : 'white'} />
            </button>
          ))}

        </div>
      )}

      <NormalInput
        type="string"
        label="Titel (optional)"
        name="capture"
        group
        value={ownComment.capture}
        placeholder="Gebe einen Titel an"
        // error={fieldErrors.capture}
        change={changeValue}
      />

      <TextInput
        label={`Dein ${type === 'rating' ? 'Bewertung (optional)' : 'Tipp'}`}
        name="comment"
        value={ownComment.comment}
        placeholder="Beschreibe dein Statement"
        change={changeValue}
      />

      <FormButton disabled={!user.uid} label={`${type === 'rating' ? 'Bewertung' : 'Tipp'} abschicken`} action={() => commitRating()} />

      {!!ownComment.oldRating && <p class="red">Mit einer neuen Bewertung, werden alle Votes auf 0 zurückgesetzt</p>}
      <p style={{ color: 'var(--fifth)' }}>Hilf anderen und neuen Besuchern und gebe Ihnen mit deiner Bewertung eine Bewertungsgrundlage. Beschreibe dein Erlebnis in Worten und beschreibe was dich zu deiner Bewertung führt.</p>
    </Fragment>
  );
};

export default AddRating;
