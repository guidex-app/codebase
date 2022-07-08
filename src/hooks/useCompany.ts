import { useEffect, useState } from 'preact/hooks';

import { getFireDocument } from '../data/fire';
import { Activity } from '../interfaces/activity';

const useCompany = (id: string, activity?: Activity, isTopic?: true): Activity | undefined => {
  const [data, setData] = useState<Activity | undefined>(activity);

  useEffect(() => {
    if (!activity && id && id !== 'new') {
      getFireDocument(`${isTopic ? 'topics' : 'activities'}/${id}`).then((act: Activity) => {
        setData(act);
      });
    }
  }, []);

  return data;
};

export default useCompany;
