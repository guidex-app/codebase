import { FunctionalComponent, h } from 'preact';
import { useMemo } from 'preact/hooks';

import { randomNumber } from '../../helper/number';
import { Location, Weather } from '../../interfaces/user';
import Chooser from '../chooser';
import style from './style.module.css';

interface TeaserProps {
  data?: { weather?: Weather, location?: Location};
  openModal: (type: 'Tag' | 'Wetter' | 'Standort' | 'Filtern') => void;
}

const Teaser: FunctionalComponent<TeaserProps> = ({ data, openModal }: TeaserProps) => {
  const image = useMemo(() => `url("../../assets/header/${randomNumber(1, 5)}.jpg")`, []);
  const dayNames = { today: 'heute', tomorrow: 'morgen', weekend: 'am Wochenende' };

  return (
    <section class={style.teaser} style={{ backgroundImage: image }}>
      <div>
        <h1>Was möchtest du<br />{dayNames.today} unternehmen?</h1>
        <p>Deine individuellen Vorschläge für {data?.location?.city || 'Hamburg'}</p>

        <Chooser action={openModal} />

        {/* {globalWeather ? <Chooser openModal={openModal} weatherName={globalWeather[1]} /> : <div style={{ borderRadius: '33px', background: 'var(--ion-color-dark)', height: '55px', maxWidth: '350px', width: '85%' }} /> } */}
        <small class={style.weatherText}>{data?.weather?.description || 'Überwiegend bewölkt'}</small>
      </div>
    </section>
  );
};

export default Teaser;
