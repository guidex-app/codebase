import { FunctionalComponent, h } from 'preact';
import { useMemo } from 'preact/hooks';
import { randomNumber } from '../../helper/number';
import { Weather, Location } from '../../interfaces/user';
import Chooser from '../chooser';

import style from './style.module.css';

interface TeaserProps {
  location?: Location;
  weather?: Weather;
  openModal: (type: 'Tag' | 'Wetter' | 'Standort' | 'Filtern') => void;
}

const Teaser: FunctionalComponent<TeaserProps> = ({ weather, location, openModal }: TeaserProps) => {
  const randomImage = ['1', '2', '3', '4', '5'];
  const image = useMemo(() => `url("../../assets/header/${randomImage[randomNumber(0, 4)]}.jpg")`, []);

  // const randomValue: any = useMemo(() => Math.floor(Math.random() * (2 - 0) + 0), []);
  const dayNames = {
    today: 'heute',
    tomorrow: 'morgen',
    weekend: 'am Wochenende',
  };

  return (
    <section class={style.teaser} style={{ backgroundImage: image }}>
      <div>
        <h1>Was möchtest du<br />{dayNames.today} unternehmen?</h1>
        <p>Deine individuellen Vorschläge für <span>{location?.city}</span></p>

        <Chooser action={openModal} />

        {/* {globalWeather ? <Chooser openModal={openModal} weatherName={globalWeather[1]} /> : <div style={{ borderRadius: '33px', background: 'var(--ion-color-dark)', height: '55px', maxWidth: '350px', width: '85%' }} /> } */}
        <small class={style.weatherText}>{weather?.description}</small>
      </div>
    </section>
  );
};

export default Teaser;
