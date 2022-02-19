import { Fragment, FunctionalComponent, h } from 'preact';
import { Archive } from 'react-feather';

import FormButton from '../../../../components/form/basicButton';
import SelectInput from '../../../../components/form/selectInput';
import Item from '../../../../components/item';
import { ServiceInfo } from '../../../../interfaces/company';
import style from './style.module.css';

interface ReserveInfoProps {
  service?: ServiceInfo;
  list: ServiceInfo[];
  changeState: (type: 'info' | 'available') => void;
}

const ReserveInfo: FunctionalComponent<ReserveInfoProps> = ({ list, service, changeState }: ReserveInfoProps) => (
  <Fragment>
    {list && (list?.length >= 1 || list?.[1]) && (
    <SelectInput
      icon={<Archive />}
      label="Wähle eine Leistung aus"
      name="category"
      value={service?.serviceName}
      options={list.map((item: ServiceInfo) => item.serviceName || '')}
      change={() => console.log('da')}
    />
    )}

    <Item label={service?.serviceName || ''} type="grey" text={service?.description} image="https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/categories%2Fautokino%2Fautokino_250x200" />

    <table class={style.table} cellSpacing="0" cellPadding="0" style={{ margin: '15px 0' }}>
      <tbody>
        <tr><td>💶 10 - 20 €</td><td>👩‍👧 10 - 15 Pers.</td></tr>
        <tr><td>⏱ ab 30 Min.</td><td>...</td></tr>
      </tbody>
    </table>

    <FormButton action={() => changeState('available')} label="Verfügbarkeiten prüfen" />

  </Fragment>
);

export default ReserveInfo;
