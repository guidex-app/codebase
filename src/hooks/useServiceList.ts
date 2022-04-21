import { useEffect, useState } from 'preact/hooks';

import { getFireCollection } from '../data/fire';
import { ServiceInfo } from '../interfaces/company';

const useServiceList = (activityID: string): { serviceList: ServiceInfo[] | undefined | false, updateServiceList: (item?: ServiceInfo) => void } => {
  const [serviceList, setServiceList] = useState<ServiceInfo[] | undefined | false>(false);

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
    try {
      const serviceListData = await getFireCollection(`activities/${activityID}/services/`, false);
      if (serviceListData[0]) return setServiceList(serviceListData);
      return setServiceList(undefined);
    } catch (error) {
      setServiceList(undefined);
    }
  };

  useEffect(() => { if (serviceList === false) loadList(); }, []);

  return { serviceList, updateServiceList };
};

export default useServiceList;
