import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { PlusCircle, ToggleLeft } from 'react-feather';
import Modal from '../../container/modal';
import { getFireCollection, voteItem } from '../../data/fire';
import { RatingComment } from '../../interfaces/rating';
import { User } from '../../interfaces/user';
import Item from '../item';
import AddRating from './add';
import VisuellOverview from './overview';
import UserCommentItem from './userItem';

interface RatingProps {
  activityId: string;
  user: User;
  rating?: [number, number, number, number, number];
}

const Rating: FunctionalComponent<RatingProps> = ({ user, activityId, rating = [0, 0, 0, 0, 0] }: RatingProps) => {
  const [newRating, setNewRating] = useState<boolean>(false);
  const [segment, setSegment] = useState<'tipps' | 'rating'>('rating');
  const [list, setList] = useState<RatingComment[]>([]);

  const toggleRating = (): void => setNewRating(!newRating);

  useEffect(() => {
    if (segment && activityId) {
      getFireCollection(`activities/${activityId}/${segment}`, 'vote', undefined, 30).then((data: RatingComment[]) => {
        setList(data);
      });
    }
  }, [activityId, segment]);

  const vote = (commentUID: string, type: 'add' | 'remove', userVote?: number) => {
    if (user.uid && commentUID) {
      voteItem(`activities/${activityId}/${segment}`, `activities/${activityId}/${segment}/${commentUID}/votes`, user.uid, commentUID, type).then(() => {
        const ratingIndex = list.findIndex((ra: RatingComment) => ra.uid === commentUID);
        if (ratingIndex !== -1) {
          const newList: RatingComment[] = list;
          const addRating: RatingComment[] = list.splice(ratingIndex, 1);
          if (type === 'remove') return setList([...newList, { ...addRating?.[0], vote: userVote === 1 ? 0 : -1 }]);
          return setList([...newList, { ...addRating[0], vote: userVote === -1 ? 0 : 1 }]);
        }
      });
    }
  };

  return (
    <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.03', borderRadius: '20px', marginBottom: '20px' }}>

      <Item icon={<ToggleLeft />} label={`${segment === 'rating' ? 'Tipps' : 'Bewertungen'} anzeigen`} type="grey" action={() => setSegment(segment === 'rating' ? 'tipps' : 'rating')} />
      {segment === 'rating' && <VisuellOverview rating={rating} />}
      <Item icon={<PlusCircle />} type="grey" label={segment === 'rating' ? 'Jetzt bewerten' : 'Neuer Tipp'} text={`Lege ein${segment === 'rating' ? ' Tipp' : 'e Bewertung'} an`} action={toggleRating} />

      {list?.map((rate: RatingComment) => (
        <UserCommentItem rate={rate} vote={vote} />
      ))}

      {newRating && (
        <Modal title={`${segment === 'rating' ? 'Bewertung' : 'Tipp'} schreiben (${user.displayName})`} close={toggleRating}>
          <AddRating user={user} type={segment} activityId={activityId} close={toggleRating} />
        </Modal>
      )}
    </div>
  );
};
export default Rating;
