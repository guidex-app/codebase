import { FunctionalComponent, h } from 'preact';
import Router, { route, Route } from 'preact-router';
import { useState } from 'preact/hooks';
import { Activity } from '../../interfaces/activity';
import { User } from '../../interfaces/user';
import NotFoundPage from '../../routes/notfound';
import Availabilities from './availabilities';
import Basic from './basic';
import Contact from './contact';
import Dashboard from './dashboard';
import Documents from './documents';
import Images from './images';
import List from './list';
import Openings from './openings';

import Reservations from './reservations';
import Services from './services';
import Specific from './specific';
import Prices from './prices';

interface ManagementProps {
  user: User;
}

const Management: FunctionalComponent<ManagementProps> = ({ user }: ManagementProps) => {
  const [activity, setActivity] = useState<Activity | undefined>(undefined);
  if (!user.email) route('/login/');
  return (
    <Router>
      <Route path="/company/" component={List} setActivity={setActivity} />
      <Route path="/company/dashboard/:activityID" component={Dashboard} activity={activity} />
      <Route path="/company/basic/:activityID" component={Basic} activity={activity} uid={user.uid} />
      <Route path="/company/contact/:activityID" component={Contact} activity={activity} uid={user.uid} />
      <Route path="/company/openings/:activityID" component={Openings} activity={activity} uid={user.uid} />
      <Route path="/company/specific/:activityID" component={Specific} activity={activity} uid={user.uid} />
      <Route path="/company/images/:activityID" component={Images} activity={activity} uid={user.uid} />
      <Route path="/company/availabilities/:activityID" component={Availabilities} activity={activity} uid={user.uid} />
      <Route path="/company/documents/:activityID" component={Documents} activity={activity} uid={user.uid} />
      <Route path="/company/services/:activityID" component={Services} activity={activity} uid={user.uid} />
      <Route path="/company/prices/:activityID" component={Prices} activity={activity} uid={user.uid} />
      <Route path="/company/reservations/:activityID" component={Reservations} activity={activity} uid={user.uid} />
      <NotFoundPage default />
    </Router>
  );
};

export default Management;
