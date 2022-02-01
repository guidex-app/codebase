import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';

import { useEffect, useReducer } from 'preact/hooks';
import Cats from '../routes/cats';
import NotFoundPage from '../routes/notfound';

import Admin from '../routes/admin';
import { getStorageKeys } from '../data/localStorage';
import SignIn from '../routes/signIn';
import Explore from '../routes/explore';
import Register from '../routes/register';
import { User } from '../interfaces/user';
import Management from '../routes/management';
import Profile from '../routes/profile';
import ActivityList from '../routes/activity';
import Details from '../routes/details';
import TopicPage from '../routes/topic';

const AppRoutes: FunctionalComponent = () => {
  const [user, updateUser] = useReducer((state: User, newState: User) => ({ ...state, ...newState }), {});

  const getUserData = async () => {
    const userData: User = await getStorageKeys(['displayName', 'email', 'weather', 'location', 'uid']);
    updateUser(userData);
  };

  /** lädt die user daten beim start */
  useEffect(() => { getUserData(); }, []);

  return (

    <Router>
      <Route path="/" component={Cats} user={user} updateUser={updateUser} />
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
