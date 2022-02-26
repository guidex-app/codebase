import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import Router, { Route, route } from 'preact-router';

import { Activity } from '../../interfaces/activity';
import NotFoundPage from '../../routes/notfound';
import Availabilities from './availabilities';
import Basic from './basic';
import Contact from './contact';
import Dashboard from './dashboard';
import Documents from './documents';
import Images from './images';
import List from './list';
import Openings from './openings';
import Prices from './prices';
import Reservations from './reservations';
import Services from './services';
import Specific from './specific';

interface ManagementProps {
  uid: string;
}

const Management: FunctionalComponent<ManagementProps> = ({ uid }: ManagementProps) => {
  const [activity, setActivity] = useState<Activity | undefined>(undefined);
  if (!uid) route('/login/');
  return (
    <Router>
      <Route path="/company/" component={List} setActivity={setActivity} />
      <Route path="/company/dashboard/:activityID" component={Dashboard} activity={activity} />
      <Route path="/company/basic/:activityID" component={Basic} activity={activity} uid={uid} />
      <Route path="/company/contact/:activityID" component={Contact} activity={activity} uid={uid} />
      <Route path="/company/openings/:activityID" component={Openings} activity={activity} uid={uid} />
      <Route path="/company/specific/:activityID" component={Specific} activity={activity} uid={uid} />
      <Route path="/company/images/:activityID" component={Images} activity={activity} uid={uid} />
      <Route path="/company/availabilities/:activityID" component={Availabilities} activity={activity} uid={uid} />
      <Route path="/company/documents/:activityID" component={Documents} activity={activity} uid={uid} />
      <Route path="/company/services/:activityID" component={Services} activity={activity} uid={uid} />
      <Route path="/company/prices/:activityID" component={Prices} activity={activity} uid={uid} />
      <Route path="/company/reservations/:activityID" component={Reservations} activity={activity} uid={uid} />
      <NotFoundPage default />
    </Router>
  );
};

export default Management;
