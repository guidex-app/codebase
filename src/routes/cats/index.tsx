import { FunctionalComponent, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Feather } from 'react-feather';
import FabButton from '../../components/fabButton';
import FilterList from '../../components/filter';
import FilterBar from '../../components/filterBar';
import LocationList from '../../components/locationList';
import Masonry from '../../components/masonry';
import Teaser from '../../components/teaser';
import WeatherList from '../../components/weatherList';
import Modal from '../../container/modal';
import catFilter from '../../data/catFilter';
import { getFireCollection } from '../../data/fire';
import { setStorageKeys } from '../../data/localStorage';
import getGeoLocation from '../../data/location';
import getWeather from '../../data/weather';
import { isDayGreater } from '../../helper/date';
import { User, Weather, Location } from '../../interfaces/user';
import style from './style.css';

interface CatsProps {
  user: User;
  updateUser: (data: User) => void;
}

const Cats: FunctionalComponent<CatsProps> = ({ user, updateUser }: CatsProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState<undefined | 'Filtern' | 'Tag' | 'Wetter' | 'Standort'>(undefined);

  const closeModal = () => setOpenModal(undefined);

  const fetchCategories = async () => {
    if (user.interests) {
      console.log('load new cats | interests');
      const c: any = await getFireCollection(`geo/${user.location?.geoHash}/categories`, false, [['filter', 'array-contains-any', user.interests]], 10);
      setCategories(c);
    } else {
      console.log('load new cats');
      const c: any = await getFireCollection(`geo/${user.location?.geoHash}/categories`, 'count', undefined, 10);
      setCategories(c);
    }
  };

  const updateData = async () => {
    console.log('load new location & weather');
    const l: Location = await getGeoLocation();
    const w: Weather = await getWeather('today', l.lat, l.lng);
    setStorageKeys({ weather: JSON.stringify(w), location: JSON.stringify(l) });
    updateUser({ weather: w, location: l });
  };

  const loadStartData = () => {
    if (user.weather && user.location && !isDayGreater(user.location.date, 1)) {
      fetchCategories();
    } else {
      updateData();
    }
  };

  useEffect(() => {
    loadStartData();
  }, [user]);

  return (
    <div class={style.cats}>
      <Teaser openModal={setOpenModal} weather={user?.weather} location={user?.location} />
      <FilterBar />
      <Masonry items={categories} />
      <FabButton icon={<Feather size={35} color="#581e0d" />} hide={!!openModal} action={() => setOpenModal('Filtern')} />
      {!!openModal && (
      <Modal title={openModal} close={closeModal}>
        {openModal === 'Filtern' && <FilterList data={catFilter} values={['we_sunny']} />}
        {openModal === 'Standort' && <LocationList />}
        {openModal === 'Tag' && <WeatherList />}
      </Modal>
      )}
    </div>
  );
};

export default Cats;
