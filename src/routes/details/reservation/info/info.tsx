import { FunctionalComponent, h } from 'preact';

import Item from '../../../../components/item';
import { ServiceInfo } from '../../../../interfaces/company';

interface ReserveInfoProps {
  serviceList: ServiceInfo[];
  activityID: string;
  selectService: (type: ServiceInfo) => void;
}

const ReserveInfo: FunctionalComponent<ReserveInfoProps> = ({ serviceList, activityID, selectService }: ReserveInfoProps) => (
  <section class="group form">
    <h3>Leistungen</h3>
    {serviceList.map((x: any, i: number) => (
      <Item image={`https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/activities%2F${activityID}%2Fservices%2F${i}%2F${i}_250x200`} text={x.description || 'Verfügbarkeit Checken'} label={x.serviceName || ''} action={() => selectService(x)} />
    ))}
  </section>
);
export default ReserveInfo;
