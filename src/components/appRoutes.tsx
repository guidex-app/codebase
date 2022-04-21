import { FunctionalComponent, h } from 'preact';
import { useEffect, useReducer, useState } from 'preact/hooks';
import { Route, Router } from 'preact-router';

import { getStorageKeys, setStorageKeys } from '../data/localStorage';
import getWeather from '../data/weather';
import { Location, User, Weather } from '../interfaces/user';
import ActivityList from '../routes/activity';
import Admin from '../routes/admin';
import Cats from '../routes/cats';
import Details from '../routes/details';
import Explore from '../routes/explore';
import Management from '../routes/management';
import NotFoundPage from '../routes/notfound';
import Profile from '../routes/profile';
import Register from '../routes/register';
import SignIn from '../routes/signIn';
import TopicPage from '../routes/topic';

const AppRoutes: FunctionalComponent = () => {
  const [user, updateUser] = useReducer((state: User, newState: User) => ({ ...state, ...newState }), {});
  const [weatherList, setWeatherList] = useState<Weather[] | undefined>();

  const getNewLocation = async (forDay: number) => {
    const location: Location = {
      lat: 53.5510846,
      lng: 9.9936818,
      city: 'Hamburg',
      geoHash: 'u1x0',
      date: new Date(new Date().setDate(new Date().getDate() + forDay)).getTime(),
    };

    let weather: Weather[] | undefined;

    if (weatherList) {
      weather = weatherList;
    } else {
      weather = await getWeather(location.lat, location.lng);
      setWeatherList(weather);
    }

    console.log(weather);

    setStorageKeys({ location: JSON.stringify({ ...location, weather: weather[forDay] }) });
    updateUser({ location: { ...location, weather: weather[forDay] } });
  };

  const getUserData = async () => {
    const userData: User = await getStorageKeys(['displayName', 'email', 'location', 'uid']);
    updateUser(userData);
    // if (userData.location?.weather && isDayGreater(userData.location.date, 1)) return updateUser(userData);
    return getNewLocation(0);
  };

  /** lädt die user daten beim start */
  useEffect(() => { getUserData(); }, []);

  return (

    <Router>
      <Route path="/" component={Cats} getNewLocation={getNewLocation} location={user.location} interests={user.interests} />
      <Route path="/explore/" component={Explore} />
      <Route path="/explore/:topicID" component={TopicPage} location={user.location} />

      <Route path="/admin/" component={Admin} />

      {/* <AsyncRoute path="/company/:rest*" component={Management} user={user} /> */}
      <Route path="/company/:rest*" component={Management} uid={user.uid} />
      <Route path="/activity/:categoryID" component={ActivityList} day={user.location?.date} />
      <Route path="/profile/" component={Profile} updateUser={updateUser} />
      <Route path="/register/" component={Register} updateUser={updateUser} />
      <Route path="/register/:company" component={Register} updateUser={updateUser} />
      <Route path="/login/" component={SignIn} updateUser={updateUser} />
      <Route path="/logout" component={SignIn} updateUser={updateUser} logout="logout" />
      <Route path="/activity/:categoryID/:activityID" user={user} component={Details} day={user.location?.date} />
      <NotFoundPage default />
    </Router>

  );
};

export default AppRoutes;
