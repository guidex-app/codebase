import { useEffect, useState } from 'preact/hooks';

import { getFireDocument } from '../data/fire';
import { Activity } from '../interfaces/activity';

const useCompany = (activityID: string, activity?: Activity, type?: 'topics'): Activity | undefined => {
  const [data, setData] = useState<Activity | undefined>(activity);

  useEffect(() => {
    if (!activity && activityID && activityID !== 'new') {
      console.log('wird geladen');
      getFireDocument(`${type || 'activities'}/${activityID}`).then((act: Activity) => {
        setData(act);
      });
    }
  }, [activityID]);

  return data;
};

export default useCompany;
