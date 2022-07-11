import { IconAdjustmentsHorizontal } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import FabButton from '../../components/fabButton';
import FilterList from '../../components/filter';
import FilterBar from '../../components/filterBar';
import LocationList from '../../components/locationList';
import BasicMasonry from '../../components/masonry/basicMasonry';
import Teaser from '../../components/teaser';
import WeatherList from '../../components/weatherList';
import Modal from '../../container/modal';
import catFilter from '../../data/catFilter';
import filterCats from '../../data/filter';
import { getFireCollection } from '../../data/fire';
import getWeather from '../../data/weather';
import { smallerThanDays } from '../../helper/date';
import useTitle from '../../hooks/seo/useTitle';
import { Cat } from '../../interfaces/categorie';
import { Location, User, Weather } from '../../interfaces/user';

interface CatsProps {
  location?: Location;
  weather?: Weather;
  day?: string;
  updateUser: (data: User) => void;
}

const Cats: FunctionalComponent<CatsProps> = ({ location, weather, day = 'Heute', updateUser }: CatsProps) => {
  useTitle('Guidex | Dein Unternehmungs-Ratgeber für jede Wetterlage');

  const [filter, setFilter] = useState<string[]>([]);
  const [filteredCats, setFilteredCats] = useState<Cat[] | undefined | false>(false);
  const [weatherList, setWeatherList] = useState<Weather[] | false>(false);
  const [catList, setCatList] = useState<Cat[] | false>(false);

  const [openModal, setOpenModal] = useState<undefined | 'Filter' | 'Tag' | 'Wetter' | 'Standort'>(undefined);

  const closeModal = () => setOpenModal(undefined);

  const getFilteredCats = () => {
    if (catList === false || weatherList === false) return;
    const newCats = filterCats(catList, filter, weatherList[0]);
    return setFilteredCats(newCats);
  };

  const fetchCats = (): any => getFireCollection(`geo/${location?.geoHash}/categories`, 'sortCount', undefined, 200);

  const getWeatherData = async (): Promise<Weather[]> => {
    if (!location) return [];

    const updated = weather?.lastUpdated;
    if (updated && smallerThanDays(new Date(updated), 1)) return [weather];
    return getWeather(location.lat, location.lng);
  };

  const getData = async () => {
    const [weatherData, cats] = await Promise.all([getWeatherData(), fetchCats()]);

    setWeatherList(weatherData);
    setCatList(cats);
  };

  const changeDay = (dayString: string) => {
    updateUser({ day: dayString });
    closeModal();
  };

  const changeLocation = (newLocation: Location) => {
    updateUser({ location: newLocation });
    closeModal();
  };

  // update cats
  useEffect(() => { getFilteredCats(); }, [filter, catList, weatherList]);

  // start daten
  useEffect(() => { getData(); }, [location]);

  return (
    <Fragment>
      <Teaser openModal={setOpenModal} day={['Heute', 'Morgen'].includes(day) ? day : day.substring(0, 2)} weather={weatherList !== false ? weatherList[0] : undefined} location={location} />
      <FilterBar />
      <BasicMasonry list={filteredCats} />
      <FabButton icon={<IconAdjustmentsHorizontal size={35} color="#581e0d" />} hide={!!openModal} action={() => setOpenModal('Filter')} />
      {!!openModal && (
        <Modal title={`${openModal} auswählen`} close={closeModal}>
          {openModal === 'Filter' && <FilterList data={catFilter} values={filter} change={setFilter} close={closeModal} />}
          {openModal === 'Standort' && <LocationList changeLocation={changeLocation} />}
          {openModal === 'Tag' && <WeatherList changeDay={changeDay} />}
        </Modal>
      )}
    </Fragment>
  );
};

export default Cats;
