import { IconEdit, IconToggleLeft } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import Modal from '../../container/modal';
import { getFireCollection, voteItem } from '../../data/fire';
import { RatingComment } from '../../interfaces/rating';
import { User } from '../../interfaces/user';
import Chip from '../chip';
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
  const [newRating, setNewRating] = useState<number | false>(false);
  const [segment, setSegment] = useState<'tipps' | 'rating'>('rating');
  const [list, setList] = useState<RatingComment[] | undefined>(undefined);

  const getRatings = async () => {
    const data: RatingComment[] | undefined = await getFireCollection(`activities/${activityId}/${segment}`, 'vote', undefined, 30);
    setList(data);
  };

  useEffect(() => {
    if (segment && activityId) getRatings();
  }, [activityId, segment]);

  const vote = (commentUID: string, type: 'add' | 'remove', userVote?: number) => {
    if (user.uid && commentUID && list) {
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

      <Item icon={<IconToggleLeft color="var(--orange)" />} label={`${segment === 'rating' ? 'Tipps' : 'Bewertungen'} anzeigen`} type="info" action={() => setSegment(segment === 'rating' ? 'tipps' : 'rating')} />
      {segment === 'rating' && (
        <Fragment>
          <VisuellOverview rating={rating} />
          <Chip type="active" label="1 ★" action={() => setNewRating(1)} />
          <Chip type="active" label="2 ★" action={() => setNewRating(2)} />
          <Chip type="active" label="3 ★" action={() => setNewRating(3)} />
          <Chip type="active" label="4 ★" action={() => setNewRating(4)} />
          <Chip type="active" label="5 ★" action={() => setNewRating(5)} />
        </Fragment>
      )}

      <Item type="info" icon={<IconEdit />} label={`Verfasse eine${segment === 'rating' ? ' neue Bewertung' : 'n neuen Tipp'}`} text="Hast du eine Bericht oder eine Erklärung zu deiner Bewertung" action={() => setNewRating(3)} />

      {/* <Item icon={<PlusCircle />} type="grey" label={segment === 'rating' ? 'Jetzt bewerten' : 'Neuer Tipp'} text={`Lege ein${segment === 'rating' ? ' Tipp' : 'e Bewertung'} an`} action={toggleRating} /> */}

      {list?.map((rate: RatingComment) => (
        <UserCommentItem rate={rate} vote={vote} />
      ))}

      {newRating && (
        <Modal title={`${segment === 'rating' ? 'Bewertung' : 'Tipp'} schreiben (${user.displayName})`} close={() => setNewRating(false)}>
          <AddRating user={user} rating={newRating} type={segment} activityId={activityId} close={() => setNewRating(false)} />
        </Modal>
      )}
    </div>
  );
};
export default Rating;
