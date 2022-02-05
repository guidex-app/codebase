import { FunctionalComponent, h } from 'preact';
import { MapPin, Navigation } from 'react-feather';

import Item from '../item';

interface LocationProps {

}

const LocationList: FunctionalComponent<LocationProps> = () => (
  <div>
    <Item label="Aktueller Standort" icon={<Navigation />} type="grey" />
    <Item label="In Hamburg suchen" icon={<MapPin />} />
    <Item label="In Berlin suchen" icon={<MapPin />} />
    <Item label="In München suchen" icon={<MapPin />} />

    <Item label="In Köln suchen" icon={<MapPin />} />
    <Item label="In Leipzig suchen" icon={<MapPin />} />
  </div>
);

export default LocationList;
