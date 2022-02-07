import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Calendar, Info } from 'react-feather';

import Chip from '../../../components/chip';
import FormButton from '../../../components/form/basicButton';
import SelectInput from '../../../components/form/selectInput';
import Item from '../../../components/item';
import { fireDocument, getFireCollection } from '../../../data/fire';
import getQuestFormValue from '../../../helper/priceStructure';
import { ServiceField } from '../../../interfaces/company';
import { PriceTerms } from '../../../interfaces/reservation';
import style from '../../../style/table.module.css';

interface EditPricesProps {
    structureID: number;
    activityID: string;
    serviceID: string;
    questionLength: number;
    changeType: (newType?: 'belongs' | 'prices') => void;
    editStructure: (field: ServiceField[]) => void;
}

interface PriceRows {
    row: string[];
    columns: number[];
}

// interface PriceItem {
//   col: string;
//   row: string;
//   onDay: string;
//   value: number;
// }

const EditPrices: FunctionalComponent<EditPricesProps> = ({ structureID, changeType, activityID, serviceID, questionLength, editStructure }: EditPricesProps) => {
  const [status, setStatus] = useState<{
    isRound?: boolean;
    hasTime?: boolean;
    foundation?: string;
    day?: string;
  }>({});

  // listen
  const [structureFields, setStructureFields] = useState<ServiceField[]>();
  const [durationList, setDurationList] = useState<string[]>([]);
  const [dayList, setDayList] = useState<string[]>();

  // tabelle
  const [columns, setColumns] = useState<[number, number][]>([]);
  const [rows, setRows] = useState<PriceRows[]>([]); // cell array in a row array
  const [prices, setPrices] = useState<PriceTerms[] | false | undefined>(); // cell array in a row array

  // farben
  const colorList: string[] = ['#FFFFFF', '#d4be21', '#2fd159'];

  const changeDay = (value: any) => setStatus({ ...status, day: value });

  /**
   * z.B.: 1 Runde bei 8 Pers.
   * z.B.: 8 Pers.
   * z.B.: 5 Runden bei 1 Pers.
   */
  // const getColumnName = (p: string, d: string): string => (
  //   `${p ? `${p} Pers.` : ''} ${d && p ? `bei ${d} ${status.isRound ? 'Runde' : 'Min.'}` : d || ''}`
  // );

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
        const priceValues = columns.map(([persons, duration]: [number, number]) => (
          prices?.find((p: PriceTerms) => p.id === `${row.toString()}_${persons}_${duration}`)?.value || 0.00
        ));
        return { row, columns: priceValues };
      });

      setRows(rowValues);
    }
  };

  const generateColumns = () => {
    if (status.day) {
      const newColumns: [number, number][] = [];

      const { list: personList } = getQuestFormValue(status.day, structureFields?.find((x) => x.name === 'persons')?.answers, ['1']);
      const foundation: string = getQuestFormValue(status.day, structureFields?.find((x) => x.name === 'foundation')?.answers)?.list?.[0] || 'person';

      personList.forEach((person: string) => durationList.forEach((duration: string) => {
        // const text: string = foundation === 'object' ? `1 Raum (${getColumnName(p, d)})` : getColumnName(p, d);
        newColumns.push([+person, +duration]);
      }));

      setColumns(newColumns);
      setStatus({ ...status, foundation });
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
    getFireCollection(`activities/${activityID}/services/${serviceID}/prices`, false, [['day', '==', currentDay]]).then((data: any[]) => setPrices(data || undefined));
  };

  // const generateNewPrices = (rowIndex: number, cellIndex: number, value: number): { [key: string]: number } => {
  //   const currentPrices: { [key: string]: number } = {};
  //   columns.forEach(([person, duration]: [number, number], i: number) => {
  //     currentPrices[`${person}_${duration}`] = cellIndex === i ? value : (rows[rowIndex].columns[i] || 0);
  //   });
  //   return currentPrices;
  // };

  const savePrice = (e: any) => {
    if (status.day) {
      const { value, id } = e.target;
      const [cellIndex, rowIndex] = id.split('_');

      const [persons, duration] = columns[cellIndex];
      const rowID = `${rows[rowIndex].row.toString()}_${persons}_${duration}`;

      const newItem: PriceTerms = { id: rowID, duration, persons, value, day: status.day };
      return fireDocument(`activities/${activityID}/services/${serviceID}/prices/${rowID}`, newItem, 'set').then(() => console.log('gespeichert'));
    }
  };

  /** Lade alle services von der activity ID */
  const loadStructureFields = async () => {
    const serviceFieldData = await getFireCollection(`activities/${activityID}/structures/${structureID}/fields`, false);
    if (serviceFieldData) {
      const days = getQuestFormValue(status.day, serviceFieldData?.find((x) => x.name === 'days')?.answers).list
      setDayList(days || []);
      setStatus({ ...status, day: !days?.[1] && days?.[0] ? days[0] : 'nothing' });
      console.log(!days?.[1] && days?.[0] ? days[0] : 'nothing');
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

          {dayList?.[1] && questionLength === structureFields?.length && (
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

<Chip small type="grey" label={questionLength === structureFields?.length ? 'Verwendete Vorlage bearbeiten' : 'Verwendete Vorlage abschließen'} action={editCurrentFields} />
            <Chip small type="delete" label="Verwendete Vorlage entfernen" action={() => changeType('belongs')} />


          {status.day && questionLength === structureFields?.length && (
          <Fragment>

            <table class={`${style.table} ${style.prices} ${status.hasTime ? style.time : ''}`} style={{ margin: '0 0 20px 0' }}>
              <thead>
                <tr>
                  {status.hasTime && <th>Uhrzeit</th>}
                  <th style={{ padding: '5px 0' }}>Rabatte</th>
                  {columns?.map(([persons, duration]: [number, number]) => <th>{persons} Pers. für {duration} Min.</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((row: PriceRows, rowIndex: number) => (
                  <tr>
                    {status.hasTime && <td>{(rowIndex === 0 || rows[rowIndex - 1].row[0] !== row.row[0]) ? row.row[0] : 's.o.'}</td>}
                    <td>{row.row.map((x, i) => (!status.hasTime || i > 0) && <span style={{ color: colorList[i], opacity: x.indexOf('Kein') > -1 ? 0.5 : 1 }}>{x}</span>)}</td>
                    {row.columns?.map((price: number, cellIndex: number) => (
                      <td class={price === 0.00 ? 'red' : 'green'}><input id={`${cellIndex}_${rowIndex}`} value={price} type="number" onChange={savePrice} min="0.00" max="10000.00" step="1" placeholder="-" /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <Item icon={<Info />} type="info" label="Wenn kein Preis angegeben ist, wird der Standartpreis verwendet." text="Für die Berechnung ist ein Preis oder Standart-Preis erforderlich" /> */}

            <FormButton action={() => changeType()} />
          </Fragment>
          )}

    </Fragment>
  );
};

export default EditPrices;
