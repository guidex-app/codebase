import { IconLocation, IconMapPin } from '@tabler/icons';
import { FunctionalComponent, h } from 'preact';

import Item from '../item';

interface LocationProps {

}

const LocationList: FunctionalComponent<LocationProps> = () => (
  <div>
    <Item label="Aktueller Standort" icon={<IconLocation />} type="grey" />
    <Item label="In Hamburg suchen" icon={<IconMapPin />} />
    <Item label="In Berlin suchen" icon={<IconMapPin />} />
    <Item label="In München suchen" icon={<IconMapPin />} />

    <Item label="In Köln suchen" icon={<IconMapPin />} />
    <Item label="In Leipzig suchen" icon={<IconMapPin />} />
  </div>
);

export default LocationList;
