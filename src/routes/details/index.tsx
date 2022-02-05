import { Fragment, FunctionalComponent, h } from 'preact';
import { MapPin, Star } from 'react-feather';

import BackButton from '../../components/backButton';
import IconScrollList from '../../components/iconScrollList';
import TextHeader from '../../components/iconTextHeader';
import Item from '../../components/item';
import OpeningsList from '../../components/openingList/openings';
import Rating from '../../components/ratings';
import useCompany from '../../hooks/useCompany';
import { User } from '../../interfaces/user';
import Reservation from './reservation';

interface DetailsProps {
    activityID: string;
    user: User;
}

const Details: FunctionalComponent<DetailsProps> = ({ activityID, user }: DetailsProps) => {
  const data = useCompany(activityID);
  if (!data) {
    return (
      <TextHeader
        icon={<Star color="#2fd159" />}
        title=""
        text="Gebe alle verüfgbaren der Unternehmung an, um diese für die Nutzer anzuzeigen"
      />
    );
  }

  return (
    <Fragment>
      <TextHeader
        icon={<Star color="#2fd159" />}
        title={data.title.name}
        text={data.description}
      />
      <main class="small_size_holder">
        <BackButton url={`/activity/${data.category.form}`} />
        <OpeningsList openings={data.openings} />
        <Item icon={<MapPin />} label="Adresse" text={`${data.address?.street}`} type="grey" />
        <Item icon={<MapPin />} label="15 km Distanz" text="Klicke um den Weg zu berechnen" type="grey" />
        <IconScrollList filter={data.filter} />
        {data.openings && <Reservation activityID={activityID} openings={data.openings} />}
        <Rating user={user} activityId={activityID} rating={data.rating} />
      </main>

    </Fragment>
  );
};

export default Details;
