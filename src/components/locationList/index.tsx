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

    {/* <Item onClick={() => preLocation('53.5510846&=9.9936818&=Hamburg&=u1x0&=u1x1&=u1qz')}>
      <IonIcon slot="start" color="medium" icon={locationOutline} />
      <IonLabel color="medium">In Hamburg suchen</IonLabel>
    </Item>
    <Item onClick={() => preLocation('52.52000659999999&=13.404954&=Berlin&=u33d&=u33e&=u333')}>
      <IonIcon slot="start" color="medium" icon={locationOutline} />
      <IonLabel color="medium">In Berlin suchen</IonLabel>
    </Item>
    <Item lines="none" onClick={() => preLocation('48.1351253&=11.5819806&=München&=u281&=u286&=u281')}>
      <IonIcon slot="start" color="medium" icon={locationOutline} />
      <IonLabel color="medium">In München suchen</IonLabel>
    </Item> */}
  </div>
);

export default LocationList;
