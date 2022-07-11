import { FunctionalComponent, h } from 'preact';
import { useMemo } from 'preact/hooks';

import { Location, Weather } from '../../interfaces/user';
import Chooser from '../chooser';
import style from './style.module.css';

interface TeaserProps {
  day: string;
  location?: Location;
  weather?: Weather;
  openModal: (type: 'Tag' | 'Wetter' | 'Standort' | 'Filter') => void;
}

const Teaser: FunctionalComponent<TeaserProps> = ({ location, day, weather, openModal }: TeaserProps) => {
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
    const currentWeather: string | 'normal' = weather?.shortName || 'Clear';
    const getImages: string[] = imageList[currentWeather] || defaultValue;
    return `url("../../assets/header/${getImages[Math.floor(Math.random() * getImages.length)]}.jpg")`;
  }, [location]);

  return (
    <section class={style.teaser} style={{ backgroundImage: image }}>
      <div>
        <h1>Was möchtest du<br />{`${day}.`} unternehmen?</h1>
        <p>Deine individuellen Vorschläge für {location?.city || 'Hamburg'}</p>

        <Chooser action={openModal} city={location?.city || 'Hamburg'} day={day} />

        {/* {globalWeather ? <Chooser openModal={openModal} weatherName={globalWeather[1]} /> : <div style={{ borderRadius: '33px', background: 'var(--ion-color-dark)', height: '55px', maxWidth: '350px', width: '85%' }} /> } */}
        <small class={style.weatherText}><strong>{weather ? `${weather?.temp}° | ${weather?.description}` : `Wetter für ${location?.city || 'Hamburg'}...`}</strong></small>
      </div>
    </section>
  );
};

export default Teaser;
