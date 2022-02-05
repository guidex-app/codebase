import { FunctionalComponent, h } from 'preact';
import { useEffect, useReducer } from 'preact/hooks';
import { Route, Router } from 'preact-router';

import { getStorageKeys, setStorageKeys } from '../data/localStorage';
import getWeather from '../data/weather';
import { isDayGreater } from '../helper/date';
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

  const getNewLocation = async () => {
    const location: Location = {
      lat: 53.5510846,
      lng: 9.9936818,
      city: 'Hamburg',
      geoHash: 'u1x0',
      date: new Date().getTime(),
    };
    const weather: Weather = await getWeather('today', location.lat, location.lng);

    setStorageKeys({ weather: JSON.stringify(weather), location: JSON.stringify(location) });
    updateUser({ weather, location });
  };

  const getUserData = async () => {
    const userData: User = await getStorageKeys(['displayName', 'email', 'weather', 'location', 'uid']);
    if (userData.weather && userData.location && !isDayGreater(userData.location.date, 1)) return updateUser(userData);
    getNewLocation();
  };

  /** lädt die user daten beim start */
  useEffect(() => { getUserData(); }, []);

  return (

    <Router>
      <Route path="/" component={Cats} user={user} />
      <Route path="/explore/" component={Explore} />
      <Route path="/explore/:topicID" component={TopicPage} />

      <Route path="/admin/" component={Admin} />

      {/* <AsyncRoute path="/company/:rest*" component={Management} user={user} /> */}
      <Route path="/company/:rest*" component={Management} user={user} />
      <Route path="/activity/:categoryID" component={ActivityList} />
      <Route path="/profile/" component={Profile} updateUser={updateUser} />
      <Route path="/register/" component={Register} updateUser={updateUser} />
      <Route path="/register/:company" component={Register} updateUser={updateUser} />
      <Route path="/login/" component={SignIn} updateUser={updateUser} />
      <Route path="/logout" component={SignIn} updateUser={updateUser} logout="logout" />
      <Route path="/activity/:categoryID/:activityID" user={user} component={Details} />
      <NotFoundPage default />
    </Router>

  );
};

export default AppRoutes;
