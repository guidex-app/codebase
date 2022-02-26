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
import filterCats from '../../data/filter';
import { getFireCollection } from '../../data/fire';
import { Cat } from '../../interfaces/categorie';
import { Location } from '../../interfaces/user';
import style from './style.css';

interface CatsProps {
  location?: Location;
  interests?: string[];
}

const Cats: FunctionalComponent<CatsProps> = ({ location, interests }: CatsProps) => {
  const [filter, setFilter] = useState<string[]>([]);
  const [filteredCats, setFilteredCats] = useState<any[]>([]);
  const [catList, setCatList] = useState<any[]>([]);

  const [openModal, setOpenModal] = useState<undefined | 'Filtern' | 'Tag' | 'Wetter' | 'Standort'>(undefined);

  const closeModal = () => setOpenModal(undefined);

  // const getNewLocation = async () => {
  //   const location: Location = await getGeoLocation();
  //   const weather: Weather = await getWeather('today', location.lat, location.lng);

  //   setStorageKeys({ weather: JSON.stringify(weather), location: JSON.stringify(location) });
  //   updateUser({ weather, location });
  // };
  const getFilteredCats = (cats: Cat[]) => {
    if (cats[0]) {
      console.time('filterCats');
      console.log('filter', filter);
      const newCats = filterCats(cats, filter, location?.weather);
      console.timeEnd('filterCats');
      return setFilteredCats(newCats);
    }
  };

  const fetchCategories = async () => {
    console.log('fetch cats', catList);

    // const alg: any = [
    //   ...(interests?.[0] ? ['filter', 'array-contains-any', interests] : []),
    // ];
    console.log('interests', interests);

    const cats: any = await getFireCollection(`geo/${location?.geoHash}/categories`, 'sortCount', undefined, 200);
    setCatList(cats);
    getFilteredCats(cats);
  };

  const updateFilter = (newFilter: string[]) => {
    setFilter(newFilter);
  };

  useEffect(() => { if (location) fetchCategories(); }, [location]);
  useEffect(() => { if (catList) getFilteredCats(catList); }, [filter]);

  return (
    <div class={style.cats}>
      <Teaser openModal={setOpenModal} location={location} />
      <FilterBar />
      <Masonry list={filteredCats} />
      <FabButton icon={<Feather size={35} color="#581e0d" />} hide={!!openModal} action={() => setOpenModal('Filtern')} />
      {!!openModal && (
      <Modal title={openModal} close={closeModal}>
        {openModal === 'Filtern' && <FilterList data={catFilter} values={filter} change={updateFilter} close={closeModal} />}
        {openModal === 'Standort' && <LocationList />}
        {openModal === 'Tag' && <WeatherList />}
      </Modal>
      )}
    </div>
  );
};

export default Cats;
