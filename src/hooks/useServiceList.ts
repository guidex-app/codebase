import { useEffect, useState } from 'preact/hooks';

import { getFireCollection } from '../data/fire';
import { ServiceInfo } from '../interfaces/company';

const useServiceList = (activityID: string): { serviceList: ServiceInfo[] | undefined, updateServiceList: (item?: ServiceInfo) => void } => {
  const [serviceList, setServiceList] = useState<ServiceInfo[] | undefined>(undefined);

  const updateServiceList = (newItem?: ServiceInfo) => {
    if (newItem) {
      const newList = serviceList || [];
      const findIndex: number = newList.findIndex((x) => x.id === newItem.id);
      if (findIndex > -1) {
        newList.splice(findIndex, 1, newItem);
      } else {
        newList.push(newItem);
      }

      setServiceList([...newList]);
    }
  };

  /** Lade alle services von der activity ID */
  const loadList = async () => {
    console.log('Liste wird geladen');
    const serviceListData = await getFireCollection(`activities/${activityID}/services/`, false);
    if (serviceListData[0]) return setServiceList(serviceListData);
  };

  useEffect(() => { if (serviceList === undefined) loadList(); }, []);

  return { serviceList, updateServiceList };
};

export default useServiceList;
