import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Calendar, Edit, Info } from 'react-feather';
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
    questionLength: number;
    editStructure: (field: ServiceField[]) => void;
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

const EditPrices: FunctionalComponent<EditPricesProps> = ({ structureID, activityID, serviceID, questionLength, editStructure }: EditPricesProps) => {
  const [status, setStatus] = useState<{
    isRound?: boolean;
    hasTime?: boolean;
    day?: string;
  }>({});

  // listen
  const [structureFields, setStructureFields] = useState<ServiceField[]>();
  const [durationList, setDurationList] = useState<string[]>([]);
  const [dayList, setDayList] = useState<string[]>();

  // tabelle
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<PriceRows[]>([]); // cell array in a row array
  const [prices, setPrices] = useState<PriceItem[] | false | undefined>(); // cell array in a row array

  // farben
  const colorList: string[] = ['#66d4cf', '#2fd159', '#d4be21'];

  const changeDay = (value: any) => setStatus({ ...status, day: value });

  /**
   * z.B.: 1 Runde bei 8 Pers.
   * z.B.: 8 Pers.
   * z.B.: 5 Runden bei 1 Pers.
   */
  const getColumnName = (p: string, d: string): string => (
    `${p ? `${p} Pers.` : ''} ${d && p ? `bei ${d} ${status.isRound ? 'Runde' : 'Min.'}` : d || ''}`
  );

  const generateRowNames = () => {
    const { list: discountList } = getQuestFormValue(status.day, structureFields?.find((x) => x.name === 'discounts')?.answers, ['']);
    const { list: ageList } = getQuestFormValue(status.day, structureFields?.find((x) => x.name === 'age')?.answers, ['']);
    const { list: timeList } = getQuestFormValue(status.day, structureFields?.find((x) => x.name === 'time')?.answers, ['']);

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

    setStatus({ ...status, hasTime: !!timeList[1] });

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

      setRows(rowValues);
    }
  };

  const generateColumns = () => {
    if (status.day) {
      const newColumns: string[] = [];

      const { list: personList } = getQuestFormValue(status.day, structureFields?.find((x) => x.name === 'persons')?.answers, ['1']);
      const foundation: string = getQuestFormValue(status.day, structureFields?.find((x) => x.name === 'foundation')?.answers)?.list?.[0] || 'person';

      personList.forEach((p: string) => durationList.forEach((d: string) => {
        const text: string = foundation === 'object' ? `1 Raum (${getColumnName(p, d)})` : getColumnName(p, d);
        newColumns.push(text);
      }));

      setColumns(newColumns);
    }
  };

  const checkDuration = () => {
    const roundDiscountList = ['1'];
    const { list: newDurationList, isRound = false } = getQuestFormValue(status.day, structureFields?.find((x) => x.name === 'duration')?.answers);
    if (isRound) {
      const { list: roundDiscount } = getQuestFormValue(status.day, structureFields?.find((x) => x.name === 'roundDiscount')?.answers);
      roundDiscountList.push(...roundDiscount);
    }

    setStatus({ ...status, isRound });
    setDurationList(isRound ? roundDiscountList : newDurationList);
  };

  const loadPrices = (currentDay: string) => {
    getFireCollection(`activities/${activityID}/services/${serviceID}/prices`, false, [['onDay', '==', currentDay]]).then((data: any[]) => setPrices(data || undefined));
  };

  const savePrice = (e: any) => {
    if (status.day) {
      const { value, id } = e.target;
      const [row, col] = id.split('_');
      const newItem: PriceItem = { row, col, value: +value, onDay: status.day };
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
      const { list: days } = getQuestFormValue(status.day, serviceFieldData?.find((x) => x.name === 'days')?.answers);
      setDayList(days?.[1] ? days : []);
      if (!days?.[1]) setStatus({ ...status, day: days[0] || 'nothing' });
      setStructureFields(serviceFieldData);
    }
  };

  useEffect(() => {
    if (status.day) {
      checkDuration();
      loadPrices(status.day);
    }
  }, [status.day]); // wenn ein Tag ausgewählt wurde

  useEffect(() => { generateColumns(); }, [durationList]);
  useEffect(() => { generateRows(); }, [prices]);

  useEffect(() => { loadStructureFields(); }, [structureID]); // init

  const editCurrentFields = () => {
    if (structureFields) editStructure(structureFields);
  };

  return (
    <Fragment>
      <h1 style={{ marginBottom: '20px' }}>Preis anpassen</h1>

      {questionLength === structureFields?.length && (
        <Fragment>
          {dayList?.[1] && (
            <SelectInput
              label="Wähle eine Tagesgruppe"
              name="day"
              icon={<Calendar />}
              options={dayList || []}
              error={status.day ? 'valid' : 'invalid'}
              change={changeDay}
              value={status.day}
            />
          )}
          {status.day && (
          <Fragment>
            <Item icon={<Info />} type="info" label="Wenn kein Preis angegeben ist, wird der Standartpreis verwendet." text="Für die Berechnung ist ein Preis oder Standart-Preis erforderlich" />
            <table class={`${style.table} ${status.hasTime ? style.time : ''}`} style={{ margin: '20px 0' }}>
              <thead>
                <tr>
                  {status.hasTime && <th>Uhrzeit</th>}
                  <th style={{ padding: '5px 0' }}>Rabatte</th>
                  {columns?.map((col: string) => <th>{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((row: PriceRows, rowIndex: number) => (
                  <tr>
                    {status.hasTime && <td>{(rowIndex === 0 || rows[rowIndex - 1].name[0] !== row.name[0]) ? row.name[0] : 's.o.'}</td>}
                    <td>{row.name.map((x, i) => (!status.hasTime || i > 0) && <span style={{ color: colorList[i], opacity: x.indexOf('Kein') > -1 ? 0.5 : 1 }}>{x}</span>)}</td>
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
      )}

      <Item icon={<Edit />} type="grey" label={questionLength === structureFields?.length ? 'Vorlage bearbeiten' : 'Vorlage abschließen'} text="Für die Preisangabe wird eine Vorlage benötigt" action={editCurrentFields} />
    </Fragment>
  );
};

export default EditPrices;
