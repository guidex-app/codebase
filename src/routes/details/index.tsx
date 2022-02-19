import { Fragment, FunctionalComponent, h } from 'preact';
import { MapPin, Star } from 'react-feather';

import BackButton from '../../components/backButton';
import IconScrollList from '../../components/iconScrollList';
import TextHeader from '../../components/iconTextHeader';
import Item from '../../components/item';
import OpeningsList from '../../components/openingList/openings';
import Rating from '../../components/ratings';
import Slider from '../../components/slider';
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

  const generateImageStrings = (): string[] => {
    const images = ['image1', 'image2', 'image3', 'image4'];
    const newImages: string[] = [];
    images.forEach((x) => { if (data.state?.includes(x)) newImages.push(`https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/activities%2F${activityID}%2F${x}%2F${x}_600x450.jpeg?alt=media`); });
    return newImages;
  };

  return (
    <Fragment>
      <Slider
        images={generateImageStrings()}
        height={300}
      />

      <main class="small_size_holder">
        <BackButton url={`/activity/${data.category.form}`} />
        <h1 style={{ marginTop: '20px' }}>{data.title.name}</h1>
        <p class="grey">{data.description}</p>
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
