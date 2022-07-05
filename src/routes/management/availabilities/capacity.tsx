import { IconInfoCircle } from '@tabler/icons';
import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import NormalInput from '../../../components/form/Inputs/basic';
import Item from '../../../components/item';
import Spinner from '../../../components/spinner';
import { fireDocument, getFireCollection } from '../../../data/fire';
import { getSimpleDateString } from '../../../helper/date';
import useTimeLine from '../../../hooks/useTimeLine';
import useWeekList from '../../../hooks/useWeekList';
import style from '../../../style/table.module.css';

interface CapacityProps {
    activityID: string;
    serviceID: string;
    openings: (string | false)[];
    defaultValue: number;
    serviceType: 'entry' | 'object' | 'section';
}

interface CapacityItem {
    time: string;
    date: string;
    value: number;
}

const Capacity: FunctionalComponent<CapacityProps> = ({ activityID, serviceID, serviceType, openings, defaultValue }: CapacityProps) => {
  const [timeRange, setTimeRange] = useState<string>(getSimpleDateString(new Date()));
  const { weekList, getWeekList } = useWeekList();
  const timeLine = useTimeLine(30, openings);
  const [rows, setRows] = useState<number[][] | false>(false); // cell array in a row array

  const updateTimeRange = (value: string) => {
    setTimeRange(value);
  };

  const generateRows = (list?: CapacityItem[]) => {
    const getRows: number[][] = timeLine.map((timeRow: string) => (
      weekList.map((day: string) => (
        list?.find((d) => d.date === day && timeRow === d.time)?.value || defaultValue
      ))
    ));
    setRows(getRows);
  };

  const loadCapacity = async () => {
    const getCapacity: CapacityItem[] | undefined = await getFireCollection(`activities/${activityID}/available/${serviceID}/capacity`, false);
    generateRows(getCapacity);
  };

  const saveCapacity = (e: any) => {
    const { value, id } = e.target;
    const [date, time] = id.split('_');
    const newItem: CapacityItem = { time, date, value };
    fireDocument(`activities/${activityID}/available/${serviceID}/capacity/${time}_${date}`, newItem, 'set').then(() => console.log('gespeichert'));
  };

  useEffect(() => { loadCapacity(); }, [weekList]);
  useEffect(() => { getWeekList(new Date(timeRange)); }, []);

  const capacityInfo = { entry: 'Wie viele Personen (Tickets) wollen sie an den jeweiligen Tagen anbieten?', object: 'Wie viele Verleihobjekte wollen sie an den jeweiligen Tagen anbieten?', section: 'Wie viele Räume/Bahnen wollen sie an den jeweiligen Tagen anbieten?' };

  return (
    <div style={{ padding: '10px' }}>
      <NormalInput
        label="Bereich (5 Tage ab)"
        name="timeRange"
        change={updateTimeRange}
        value={timeRange}
        type="date"
      />

      <Item icon={<IconInfoCircle color="var(--orange)" />} type="info" label={capacityInfo[serviceType]} text="Definiere die Anzahl für die entsprechenden Tage / Uhrzeiten. Wenn die Anzahl von den standartwerten abweicht, fülle das feld aus." />

      {rows === false || !rows?.[0] ? (
        <Spinner />
      ) : (
        <table class={style.table}>
          <thead>
            <tr class={style.heading}>
              <th>Uhrzeit</th>
              {weekList?.map((cell: string) => <th>{cell}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((times: number[], rowIndex: number) => (
              <tr>
                <td class={style.heading}>{timeLine[rowIndex]} Uhr</td>
                {times?.map((time: number, cellIndex: number) => (
                  <td class={`${time !== defaultValue ? 'green' : ''} ${style.input}`}><input id={`${weekList[cellIndex]}_${timeLine[rowIndex]}`} value={time} type="number" onChange={saveCapacity} step={1} min={0} placeholder="-" /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Capacity;
