import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Calendar, Info } from 'react-feather';
import SelectInput from '../../../components/form/selectInput';
import Item from '../../../components/item';
import { deleteFireDocument, fireDocument, getFireCollection } from '../../../data/fire';
import getQuestFormValue from '../../../helper/priceStructure';
import { ServiceField } from '../../../interfaces/company';

import style from '../../../style/table.module.css';

interface EditPricesProps {
    structureID: number;
    activityID: string;
    serviceID: string;
}

interface PriceRows {
    name: string[];
    columns: number[];
}

interface PriceItem {
  col: string;
  row: string;
  onDay: string;
  value: number;
}

const EditPrices: FunctionalComponent<EditPricesProps> = ({ structureID, activityID, serviceID }: EditPricesProps) => {
  const [day, setDay] = useState<string>();
  const [dayList, setDayList] = useState<string[]>();
  const [structureFields, setStructureFields] = useState<ServiceField[]>();
  const [columns, setColumns] = useState<string[]>([]);
  const [isRoundValue, setIsRoundValue] = useState<boolean>(false);
  const [durationList, setDurationList] = useState<string[]>([]);
  const [rows, setRows] = useState<PriceRows[]>([]); // cell array in a row array
  const [prices, setPrices] = useState<PriceItem[] | false | undefined>(); // cell array in a row array
  const colorList: string[] = ['#66d4cf', '#2fd159', '#d4be21'];
  const changeDay = (value: any) => setDay(value);

  /**
   * z.B.: 1 Runde bei 8 Pers.
   * z.B.: 8 Pers.
   * z.B.: 5 Runden bei 1 Pers.
   */
  const generateTableNames = (p: string, d: string): string => {
    if (isRoundValue) return `${p ? `${p} Pers.` : ''} ${d && p ? `bei ${d} Runde` : d || ''}`;
    return `${p ? `${p} Pers.` : ''} ${d && p ? `bei ${d} Min.` : d || ''}`;
  };

  const getFoundation = (): string => {
    let foundation: string = 'persPrice';
    const getFound = structureFields?.find((x) => x.name === 'foundation');
    if (getFound?.name === 'objectPriceGroup') {
      foundation = getQuestFormValue(day, getFound.answers, []).list?.[0] || 'persPrice';
    } else {
      foundation = getFound?.answers?.[0].name || 'persPrice';
    }
    return foundation;
  };

  const generateRowNames = () => {
    const { list: discountList } = getQuestFormValue(day, structureFields?.find((x) => x.name === 'discounts')?.answers, ['']);
    const { list: ageList } = getQuestFormValue(day, structureFields?.find((x) => x.name === 'age')?.answers, ['']);
    const { list: timeList } = getQuestFormValue(day, structureFields?.find((x) => x.name === 'time')?.answers, ['']);

    const rowList: string[][] = [];

    timeList.forEach((time) => {
      discountList.forEach((disc: string) => {
        ageList.forEach((age: string) => {
          const newItem = [];
          if (timeList[1]) newItem.push(time ? `${time} Uhr` : 'Keine Zeit');
          if (ageList[1]) newItem.push(age ? `${age} Jahre` : 'Kein Alter');
          if (disc || discountList[1]) newItem.push(disc || 'Kein Rabatt');
          const hasValue = newItem.findIndex((x) => x.indexOf('Kein') === -1) !== -1;
          rowList.push(hasValue ? newItem : [...(timeList[1] ? ['Keine Zeit'] : []), 'Standart Preis']);
        });
      });
    });

    return rowList;
  };

  const generateRows = () => {
    if (prices !== false) {
      const rowNames: string[][] = generateRowNames();

      const rowValues: PriceRows[] = rowNames.map((row: string[]) => {
        const rowID = row.toString();
        const getColumns = columns.map((col: string) => (prices?.find((p) => p.row === rowID && col.toString() === p.col)?.value || 0.00));
        return { name: row, columns: getColumns };
      });

      console.log('rows', rowValues);

      setRows(rowValues);
    }
  };

  const generateColumns = () => {
    if (day) {
      const newColumns: string[] = [];

      const { list: personList } = getQuestFormValue(day, structureFields?.find((x) => x.name === 'persons')?.answers, ['1']);
      const foundation: string = getFoundation();

      personList.forEach((p: string) => durationList.forEach((d: string) => {
        const text: string = foundation === 'objectPrice' ? `1 Raum (${generateTableNames(p, d)})` : generateTableNames(p, d);
        newColumns.push(text);
      }));

      setColumns(newColumns);
    }
  };

  const checkDuration = () => {
    const roundDiscountList = ['1'];
    const { list: newDurationList, isRound = false } = getQuestFormValue(day, structureFields?.find((x) => x.name === 'duration')?.answers);
    if (isRound) {
      const { list: roundDiscount } = getQuestFormValue(day, structureFields?.find((x) => x.name === 'roundDiscount')?.answers);
      roundDiscountList.push(...roundDiscount);
    }
    setIsRoundValue(isRound);
    setDurationList(isRound ? roundDiscountList : newDurationList);
  };

  const loadPrices = (currentDay: string) => {
    getFireCollection(`activities/${activityID}/services/${serviceID}/prices`, false, [['onDay', '==', currentDay]]).then((data: any[]) => setPrices(data || undefined));
  };

  const savePrice = (e: any) => {
    if (day) {
      const { value, id } = e.target;
      const [row, col] = id.split('_');
      const newItem: PriceItem = { row, col, value: +value, onDay: day };
      if (!value || value === 0) {
        return deleteFireDocument(`activities/${activityID}/services/${serviceID}/prices/${id}`);
      }
      return fireDocument(`activities/${activityID}/services/${serviceID}/prices/${id}`, newItem, 'set').then(() => console.log('gespeichert'));
    }
  };

  /** Lade alle services von der activity ID */
  const loadStructureFields = async () => {
    const serviceFieldData = await getFireCollection(`activities/${activityID}/structures/${structureID}/fields`, false);
    if (serviceFieldData) {
      const { list: days } = getQuestFormValue(day, serviceFieldData?.find((x) => x.name === 'days')?.answers);
      setDayList(days?.[1] ? days : []);
      if (!days?.[1]) setDay(days[0] || 'nothing');
      setStructureFields(serviceFieldData);
    }
  };

  useEffect(() => {
    if (day) {
      checkDuration();
      loadPrices(day);
    }
  }, [day]); // wenn ein Tag ausgewählt wurde

  useEffect(() => { generateColumns(); }, [durationList]);
  useEffect(() => { generateRows(); }, [prices]);

  useEffect(() => { loadStructureFields(); }, [structureID]); // init

  return (
    <Fragment>
      {dayList?.[1] && (
        <Fragment>
          <SelectInput
            label="Wähle eine Tagesgruppe"
            name="day"
            icon={<Calendar />}
            options={dayList || []}
            error={day ? 'valid' : 'invalid'}
            change={changeDay}
            value={day}
          />
          {!day && <Item icon={<Info />} type="grey" label="Wählen Sie eine Tagesgruppe aus, um die Preise anzupassen." />}
        </Fragment>
      )}
      {day && (
        <Fragment>
          <Item icon={<Info />} label="Der Preis kann nur berechnet werden, wenn ein Preis angegeben ist" text="Wenn ein Standartpreis, bei nicht angabe, definiert sein, wird dieser verwendet." />
          <table class={`${style.table} ${style.price}`}>
            <thead>
              <tr>
                <th>Zeiten</th>
                <th style={{ padding: '5px 0' }}>Rabatte</th>
                {columns?.map((col: string) => <th>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row: PriceRows, rowIndex: number) => (
                <tr>
                  {row.name[0] && <td style={{ color: colorList[0], opacity: row.name[0].indexOf('Kein') > -1 ? 0.8 : 1 }}>{(rowIndex === 0 || rows[rowIndex - 1].name[0] !== row.name[0]) ? row.name[0] : 's.o.'}</td>}
                  <td>{row.name.map((x, i) => i > 0 && <span style={{ color: colorList[i], opacity: x.indexOf('Kein') > -1 ? 0.5 : 1 }}>{x}</span>)}</td>
                  {row.columns?.map((price: number, cellIndex: number) => (
                    <td class={price === 0.00 ? 'red' : 'green'}><input id={`${row.name}_${columns[cellIndex]}`} value={price} type="number" onChange={savePrice} min="0.00" max="10000.00" step="1" placeholder="-" /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Fragment>
      )}
    </Fragment>
  );
};

export default EditPrices;
