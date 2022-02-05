import { useEffect, useState } from 'preact/hooks';

import { getFireDocument } from '../data/fire';
import { Activity } from '../interfaces/activity';

const useCompany = (id: string, activity?: Activity, type?: 'topics'): any | undefined => {
  const [data, setData] = useState<Activity | undefined>(activity);

  useEffect(() => {
    if (!activity && id && id !== 'new') {
      console.log('wird geladen');
      getFireDocument(`${type || 'activities'}/${id}`).then((act: Activity) => {
        setData(act);
      });
    }
  }, [id]);

  return data;
};

export default useCompany;
