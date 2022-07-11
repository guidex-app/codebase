import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useReducer } from 'preact/hooks';
import { Route, Router } from 'preact-router';

import { getStorageKeys, setStorageKeys } from '../data/localStorage';
import { Location, User } from '../interfaces/user';
import ActivityList from '../routes/activity';
import Admin from '../routes/admin';
import Cats from '../routes/cats';
import Details from '../routes/details';
import Explore from '../routes/explore';
import ListDetails from '../routes/listDetails';
import Lists from '../routes/lists';
import Management from '../routes/management';
import NotFoundPage from '../routes/notfound';
import Profile from '../routes/profile';
import Register from '../routes/register';
import SignIn from '../routes/signIn';
import TopicPage from '../routes/topic';
import Menu from './menu';

const AppRoutes: FunctionalComponent = () => {
  const [user, updateUser] = useReducer((state: User, newState: User) => ({ ...state, ...newState }), {});

  /**
   * Verwaltet die User-Daten beim Seitenaufruf
   * 1. Daten werden aus dem Storage geladen.
   * 2. Überprüfen ob die Daten aktuell sind.
   * 3. Alten oder ggf. neue Daten einstellen.
   */
  const firstData = async () => {
    const store: User = await getStorageKeys(['location', 'day', 'weather', 'uid']);
    const DEFAULT_LOCATION: Location = { lat: 53.5510846, lng: 9.9936818, city: 'Hamburg', geoHash: 'u1x0' };
    updateUser(store.location ? store : { ...store, location: DEFAULT_LOCATION });
  };

  /** lädt die user daten beim start */
  useEffect(() => { firstData(); }, []);

  const updateData = async (newData: User) => {
    updateUser(newData);
    setStorageKeys(newData);
  };

  /**
   * 1. Location
   *    1. Storage sonst standart
   * 2. Geohash kriegen
   * 3. Wetter & Kategorien laden
   * 4. Kategorien Filtern
   */

  return (
    <Fragment>
      <Menu uid={user.uid} />

      <Router>
        <Route path="/" component={Cats} updateUser={updateData} day={user.day} weather={user.weather} location={user.location} />
        <Route path="/explore/" component={Explore} />
        <Route path="/explore/:topicID" component={TopicPage} location={user.location} />

        <Route path="/admin/" component={Admin} />

        <Route path="/lists" component={Lists} uid={user.uid} />
        <Route path="/lists/:listID" component={ListDetails} uid={user.uid} />

        <Route path="/company/:rest*" component={Management} uid={user.uid} />
        <Route path="/activity/:categoryID" component={ActivityList} day={user.day} uid={user.uid} />
        <Route path="/profile/" component={Profile} updateUser={updateUser} />
        <Route path="/register/" component={Register} updateUser={updateUser} />
        <Route path="/register/:company" component={Register} updateUser={updateUser} />
        <Route path="/login/" component={SignIn} updateUser={updateUser} />
        <Route path="/logout" component={SignIn} updateUser={updateUser} logout="logout" />
        <Route path="/activity/:categoryID/:activityID" user={user} component={Details} day={user.day} />
        <NotFoundPage default />
      </Router>
    </Fragment>
  );
};

export default AppRoutes;
