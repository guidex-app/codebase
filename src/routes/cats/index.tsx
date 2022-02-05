import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
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
import { User } from '../../interfaces/user';
import style from './style.css';

interface CatsProps {
  user: User;
}

const Cats: FunctionalComponent<CatsProps> = ({ user }: CatsProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState<undefined | 'Filtern' | 'Tag' | 'Wetter' | 'Standort'>(undefined);

  const closeModal = () => setOpenModal(undefined);

  // const getNewLocation = async () => {
  //   const location: Location = await getGeoLocation();
  //   const weather: Weather = await getWeather('today', location.lat, location.lng);

  //   setStorageKeys({ weather: JSON.stringify(weather), location: JSON.stringify(location) });
  //   updateUser({ weather, location });
  // };

  const fetchCategories = async () => {
    const interests: [string, 'array-contains-any', string[]][] | undefined = user.interests ? [['filter', 'array-contains-any', user.interests]] : undefined;

    const cats: any = await getFireCollection(`geo/${user.location?.geoHash}/categories`, 'count', interests, 10);
    return setCategories(cats);
  };

  useEffect(() => { if (user) fetchCategories(); }, [user]);

  return (
    <div class={style.cats}>
      <Teaser openModal={setOpenModal} data={{ weather: user.weather, location: user.location }} />
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
