import { IconLocation, IconMapPin } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';

import getGeoLocation from '../../data/location';
import { Location } from '../../interfaces/user';
import Item from '../item';

interface LocationProps {
  changeLocation: (newLocation: Location) => void;
}

const LocationList: FunctionalComponent<LocationProps> = ({ changeLocation }: LocationProps) => {
  const getCurrentLocation = async () => {
    const getGeo: Location = await getGeoLocation();
    console.log(getGeo);
    changeLocation(getGeo);
  };

  return (
    <Fragment>
      <Item label="Aktueller Standort" icon={<IconLocation />} type="grey" action={getCurrentLocation} />
      <Item label="In Hamburg suchen" icon={<IconMapPin />} action={() => changeLocation({ lat: 53.5510846, lng: 9.9936818, city: 'Hamburg', geoHash: 'u1x0' })} />
      <Item label="In Berlin suchen" icon={<IconMapPin />} action={() => changeLocation({ lat: 52.520008, lng: 13.404954, city: 'Berlin', geoHash: 'u33d' })} />
      <Item label="In München suchen" icon={<IconMapPin />} action={() => changeLocation({ lat: 48.137154, lng: 11.576124, city: 'München', geoHash: 'u281' })} />

      <Item label="In Köln suchen" icon={<IconMapPin />} action={() => changeLocation({ lat: 50.935173, lng: 6.953101, city: 'Köln', geoHash: 'u1hc' })} />
      <Item label="In Leipzig suchen" icon={<IconMapPin />} action={() => changeLocation({ lat: 51.340199, lng: 12.360103, city: 'Leipzig', geoHash: 'u30u' })} />
    </Fragment>
  );
};

export default LocationList;
