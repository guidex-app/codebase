import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import BasicInput from '../../../components/form/basicInput';
import { fireDocument, getFireCollection } from '../../../data/fire';
import { getSimpleDateString } from '../../../helper/date';
import useTimeLine from '../../../hooks/useTimeLine';
import useWeekList from '../../../hooks/useWeekList';
import style from './style.module.css';

interface CapacityProps {
    collection: string;
    openings: (string | false)[];
}

interface ReservationItem {
    time: string;
    date: string;
    value: number;
}

const Reservations: FunctionalComponent<CapacityProps> = ({ collection, openings }: CapacityProps) => {
  const [timeRange, setTimeRange] = useState<string>(getSimpleDateString(new Date()));
  const { weekList, getWeekList } = useWeekList();
  const timeLine = useTimeLine(30, openings);
  const [rows, setRows] = useState<number[][]>([]); // cell array in a row array

  const updateTimeRange = (value: string) => {
    setTimeRange(value);
  };

  const generateRows = (list?: ReservationItem[]) => {
    const getRows: number[][] = timeLine.map((timeRow: string) => (
      weekList.map((day: string) => (
        list?.find((d) => d.date === day && timeRow === d.time)?.value || 0
      ))
    ));
    setRows(getRows);
    console.log(getRows);
  };

  const loadCapacity = async () => {
    console.log('gestartet');
    const getCapacity: ReservationItem[] = await getFireCollection(collection, false);
    generateRows(getCapacity || undefined);
  };

  const saveCapacity = (e: any) => {
    const { value, id } = e.target;
    const [date, time] = id.split('_');
    const newItem: ReservationItem = { time, date, value };
    fireDocument(`${collection}/${id}`, newItem, 'set').then(() => console.log('gespeichert'));
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
              <th>Zeit</th>
              {weekList?.map((cell: string) => <th>{cell}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((times: number[], rowIndex: number) => (
              <tr>
                <td>{timeLine[rowIndex]}</td>
                {times?.map((time: number, cellIndex: number) => (
                  <td><input id={`${weekList[cellIndex]}_${timeLine[rowIndex]}`} value={time} type="number" onChange={saveCapacity} min={0} placeholder="-" /></td>
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

export default Reservations;
