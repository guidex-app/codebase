import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import BasicInput from '../../../components/form/basicInput';
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
}

interface CapacityItem {
    time: string;
    date: string;
    value: number;
}

const Capacity: FunctionalComponent<CapacityProps> = ({ activityID, serviceID, openings, defaultValue }: CapacityProps) => {
  const [timeRange, setTimeRange] = useState<string>(getSimpleDateString(new Date()));
  const { weekList, getWeekList } = useWeekList();
  const timeLine = useTimeLine(30, openings);
  const [rows, setRows] = useState<number[][]>([]); // cell array in a row array

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
    console.log('gestartet');
    const getCapacity: CapacityItem[] = await getFireCollection(`activities/${activityID}/available/${serviceID}/capacity`, false);
    generateRows(getCapacity || undefined);
  };

  const saveCapacity = (e: any) => {
    const { value, id } = e.target;
    const [date, time] = id.split('_');
    const newItem: CapacityItem = { time, date, value };
    fireDocument(`activities/${activityID}/available/${serviceID}/capacity/${time}_${date}`, newItem, 'set').then(() => console.log('gespeichert'));
  };

  useEffect(() => { loadCapacity(); }, [weekList]);
  useEffect(() => { getWeekList(new Date(timeRange)); }, []);

  return (
    <div style={{ padding: '10px' }}>
      <BasicInput
        label="Bereich (5 Tage ab)"
        name="timeRange"
        error={timeRange ? 'valid' : 'invalid'}
        change={updateTimeRange}
        value={timeRange}
        type="date"
      />

      <p class="grey">Definiere die Anzahl für die entsprechenden Tage / Uhrzeiten. Wenn die Anzahl von den standartwerten abweicht, fülle das feld aus.</p>
      {rows?.[0] ? (
        <table class={style.table}>
          <thead>
            <tr>
              <th>Uhrzeit</th>
              {weekList?.map((cell: string) => <th>{cell}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((times: number[], rowIndex: number) => (
              <tr>
                <td>{timeLine[rowIndex]} Uhr</td>
                {times?.map((time: number, cellIndex: number) => (
                  <td class={time !== defaultValue ? 'green' : ''}><input id={`${weekList[cellIndex]}_${timeLine[rowIndex]}`} value={time} type="number" onChange={saveCapacity} step={1} min={0} placeholder="-" /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p class="red">Wähle einen Bereich, um die Kapazitäten anzupassen.</p>
      )}
    </div>
  );
};

export default Capacity;
