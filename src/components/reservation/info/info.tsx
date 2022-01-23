import { FunctionalComponent, h } from 'preact';
import { Archive } from 'react-feather';
import { ServiceInfo } from '../../../interfaces/company';
import FormButton from '../../form/basicButton';
import SelectInput from '../../form/selectInput';
import Item from '../../item';
import style from './style.module.css';

interface ReserveInfoProps {
  service?: ServiceInfo;
  list?: ServiceInfo[] | undefined;
  changeState: (type: 'info' | 'available' | 'confirm') => void;
}

const ReserveInfo: FunctionalComponent<ReserveInfoProps> = ({ list, service, changeState }: ReserveInfoProps) => (
  <div style={{ padding: '10px' }}>
    {list && (list?.length >= 1 || list?.[0].serviceNames?.[1]) && (
    <SelectInput
      icon={<Archive />}
      label="Wähle eine Leistung aus"
      name="category"
      value={service?.serviceNames?.[0]}
      options={list.map((item: ServiceInfo) => item.serviceNames || []).flat()}
      change={() => console.log('da')}
    />
    )}

    <Item label={service?.serviceNames?.[0] || ''} type="grey" text={service?.descriptions?.[0]} image="https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/categories%2Fautokino%2Fautokino_250x200" />

    <table class={style.table} cellSpacing="0" cellPadding="0" style={{ margin: '15px 0' }}>
      <tbody>
        <tr><td>💶 10 - 20 €</td><td>👩‍👧 10 - 15 Pers.</td></tr>
        <tr><td>⏱ ab 30 Min.</td><td>...</td></tr>
      </tbody>
    </table>

    <FormButton action={() => changeState('available')} label="Verfügbarkeiten prüfen" />

  </div>
);

export default ReserveInfo;
