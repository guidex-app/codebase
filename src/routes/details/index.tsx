import { IconGlobe, IconMapPin, IconPhone } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import BackButton from '../../components/backButton';
import IconScrollList from '../../components/iconScrollList';
import TextHeader from '../../components/infos/iconTextHeader';
import Item from '../../components/item';
import OpeningsList from '../../components/openingList/openings';
import Slider from '../../components/slider';
import useCompany from '../../hooks/useCompany';
import { Activity } from '../../interfaces/activity';
import { User } from '../../interfaces/user';
import Rating from './ratings';
import Reservation from './reservation';

interface DetailsProps {
    activityID: string;
    user: User;
    day?: string;
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

      <main class="small_size_holder" style={{ marginTop: '-50px' }}>
        <BackButton url={data ? `/activity/${data.category.form}` : '/'} />
        <TextHeader
          image={`https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/activity%2F${activityID}%2F${activityID}_250x200`}
          title={data?.title.name || ''}
          shorten
          text={data?.description || ''}
        />
        {/* <h1 style={{ marginTop: '20px' }}>{data?.title.name}&nbsp;</h1>
        <p style={{ color: 'var(--fifth)' }}>{data?.description}&nbsp;</p> */}
        <OpeningsList openings={data?.openings} day={day} />
        <Item icon={<IconMapPin />} label={data ? `${data.address?.street || ''} ${data.address?.houseNumber || ''}, ${data.address?.plz || ''} ${data.address?.place || ''}` : ''} text="Klicke zum kopieren" type="info" />
        {data?.customerContact?.website && <Item icon={<IconGlobe />} label={data.customerContact?.website} text="Klicke zum öffnen" type="grey" />}
        {data?.customerContact?.phone && <Item icon={<IconPhone />} label={data?.customerContact?.phone} text="Klicke zum anrufen" type="grey" />}
        {data?.openings && <Reservation uid={user.uid} activityID={activityID} openings={data?.openings} day={day} />}
        <IconScrollList filter={data?.filter} />
        <Rating user={user} activityId={activityID} rating={data?.rating} />
      </main>

    </Fragment>
  );
};

export default Details;
