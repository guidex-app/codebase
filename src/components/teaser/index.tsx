import { FunctionalComponent, h } from 'preact';
import { useMemo } from 'preact/hooks';

import { getSimpleDateString } from '../../helper/date';
import { Location } from '../../interfaces/user';
import Chooser from '../chooser';
import style from './style.module.css';

interface TeaserProps {
  location?: Location;
  openModal: (type: 'Tag' | 'Wetter' | 'Standort' | 'Filtern') => void;
}

const Teaser: FunctionalComponent<TeaserProps> = ({ location, openModal }: TeaserProps) => {
  const image = useMemo(() => {
    const defaultValue = ['sunny', 'surf', 'beach', 'rainbow'];
    // 'Thunderstorm' | 'Drizzle' | 'Rain' | 'Snow' | 'Mist' | 'Smoke' | 'Haze' | 'Fog' | 'Sand' | 'Dust' | 'Ash' | 'Squall' | 'Tornado' | 'Clear' | 'Clouds'
    const imageList: { [key: string]: string[] } = {
      Drizzle: ['rainy', 'water'],
      Rain: ['rainy', 'water'],
      Fog: ['fog', 'water'],
      Haze: ['fog', 'water'],
      Mist: ['fog', 'water'],
      Clear: defaultValue,
      Snow: ['snowboarder', 'snow_mountainview'],
      Clouds: ['cloudy', 'mountain', 'lake'],
    };
    const currentWeather: string | 'normal' = location?.weather?.shortName || 'Clear';
    const getImages: string[] = imageList[currentWeather] || defaultValue;
    return `url("../../assets/header/${getImages[Math.floor(Math.random() * getImages.length)]}.jpg")`;
  }, [location]);
  // const image = useMemo(() => `url("../../assets/header/${imageList[location?.weather?.shortName || 'undefined'] || 'undefined'}/1.jpg")`, []);
  const dayNames = { today: 'heute', tomorrow: 'morgen', weekend: 'am Wochenende' };

  return (
    <section class={style.teaser} style={{ backgroundImage: image }}>
      <div>
        <h1>Was möchtest du<br />{dayNames.today} unternehmen?</h1>
        <p>Deine individuellen Vorschläge für {location?.city || 'Hamburg'}</p>

        <Chooser action={openModal} />

        {/* {globalWeather ? <Chooser openModal={openModal} weatherName={globalWeather[1]} /> : <div style={{ borderRadius: '33px', background: 'var(--ion-color-dark)', height: '55px', maxWidth: '350px', width: '85%' }} /> } */}
        <small class={style.weatherText}><strong>{location && getSimpleDateString(new Date(location.date))}</strong> Hamburg &middot; <strong>{location?.weather?.temp}°</strong> {location?.weather?.description || 'Überwiegend bewölkt'}</small>
      </div>
    </section>
  );
};

export default Teaser;
