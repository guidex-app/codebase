import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Globe, MapPin, Phone } from 'react-feather';

import BackButton from '../../components/backButton';
import IconScrollList from '../../components/iconScrollList';
import Item from '../../components/item';
import OpeningsList from '../../components/openingList/openings';
import Rating from '../../components/ratings';
import Slider from '../../components/slider';
import useCompany from '../../hooks/useCompany';
import { Activity } from '../../interfaces/activity';
import { User } from '../../interfaces/user';
import Reservation from './reservation';

interface DetailsProps {
    activityID: string;
    user: User;
    day?: number;
}

const Details: FunctionalComponent<DetailsProps> = ({ activityID, user, day }: DetailsProps) => {
  const data: Activity | undefined = useCompany(activityID);
  const [images, setImages] = useState<string[]>([]);

  const generateImageStrings = () => {
    const imageList: ['image1', 'image2', 'image3', 'image4'] = ['image1', 'image2', 'image3', 'image4'];
    const newImages: string[] = [];
    imageList.forEach((x) => { if (data?.state?.includes(x)) newImages.push(`https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/activities%2F${activityID}%2F${x}%2F${x}_600x450.jpeg?alt=media`); });
    setImages(newImages);
  };

  useEffect(() => { if (data) generateImageStrings(); }, [data]);

  return (
    <Fragment>
      <Slider
        images={images}
        height={300}
      />

      <main class="small_size_holder">
        <BackButton url={data ? `/activity/${data.category.form}` : '/'} />
        <h1 style={{ marginTop: '20px' }}>{data?.title.name}&nbsp;</h1>
        <p style={{ color: 'var(--fifth)' }}>{data?.description}&nbsp;</p>
        <OpeningsList openings={data?.openings} day={day} />
        <Item icon={<MapPin />} label={data ? `${data.address?.street || ''} ${data.address?.houseNumber || ''}, ${data.address?.plz || ''} ${data.address?.place || ''}` : ''} text="Klicke zum kopieren" type="info" />
        {data?.customerContact?.website && <Item icon={<Globe />} label={data.customerContact?.website} text="Klicke zum öffnen" type="grey" />}
        {data?.customerContact?.phone && <Item icon={<Phone />} label={data?.customerContact?.phone} text="Klicke zum anrufen" type="grey" />}
        {data?.openings && <Reservation activityID={activityID} openings={data?.openings} day={day} />}
        <IconScrollList filter={data?.filter} />
        <Rating user={user} activityId={activityID} rating={data?.rating} />
      </main>

    </Fragment>
  );
};

export default Details;
