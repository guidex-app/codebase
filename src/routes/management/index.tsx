import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import Router, { Route, route } from 'preact-router';

import { Activity } from '../../interfaces/activity';
import NotFoundPage from '../../routes/notfound';
import Availabilities from './availabilities';
import Basic from './basic';
import Contact from './contact';
import Contract from './contract';
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
  const updateActivity = (newFields: any) => setActivity({ ...activity, ...newFields });

  if (!uid) route('/login/');
  return (
    <Router>
      <Route path="/company/" component={List} setActivity={setActivity} uid={uid} />
      <Route path="/company/dashboard/:activityID" component={Dashboard} activity={activity} />
      <Route path="/company/basic/:activityID" component={Basic} activity={activity} updateActivity={updateActivity} uid={uid} />
      <Route path="/company/contact/:activityID" component={Contact} activity={activity} />
      <Route path="/company/contract/:activityID" component={Contract} activity={activity} />
      <Route path="/company/openings/:activityID" component={Openings} activity={activity} />
      <Route path="/company/specific/:activityID" component={Specific} activity={activity} />
      <Route path="/company/images/:activityID" component={Images} activity={activity} />
      <Route path="/company/availabilities/:activityID" component={Availabilities} activity={activity} />
      <Route path="/company/documents/:activityID" component={Documents} activity={activity} />
      <Route path="/company/services/:activityID" component={Services} activity={activity} />
      <Route path="/company/prices/:activityID" component={Prices} activity={activity} />
      <Route path="/company/reservations/:activityID" component={Reservations} activity={activity} />
      <NotFoundPage default />
    </Router>
  );
};

export default Management;
