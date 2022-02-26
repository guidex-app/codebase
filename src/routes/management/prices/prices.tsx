import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Calendar, Edit } from 'react-feather';

import Chip from '../../../components/chip';
import FormButton from '../../../components/form/basicButton';
import SelectInput from '../../../components/form/selectInput';
import Item from '../../../components/item';
import { fireDocument, getFireCollection } from '../../../data/fire';
import getQuestFormValue from '../../../helper/priceStructure';
import { ServiceField, Structure } from '../../../interfaces/company';
import { PriceItem } from '../../../interfaces/reservation';
import style from '../../../style/table.module.css';

interface EditPricesProps {
    structure: Structure;
    activityID: string;
    serviceID: string;
    questionLength: number;
    editStructure: (field: ServiceField[] | undefined, showType: 'belongs' | 'structure') => void;
}

interface PriceRows {
    row: (string | false)[];
    columns: number[];
}

const EditPrices: FunctionalComponent<EditPricesProps> = ({ structure, activityID, serviceID, questionLength, editStructure }: EditPricesProps) => {
  const [status, setStatus] = useState<{
    isRound?: boolean;
    hasTime?: boolean;
    foundation?: string;
    day?:(string);
      }>({});

  // listen
  const [structureFields, setStructureFields] = useState<ServiceField[]>();
  const [durationList, setDurationList] = useState<string[]>([]);

  // tabelle
  const [columns, setColumns] = useState<[number, number][]>([]);
  const [rows, setRows] = useState<PriceRows[]>([]); // cell array in a row array
  const [priceList, setPriceList] = useState<PriceItem[] | false | undefined>(); // cell array in a row array

  // farben
  const rowProps = [
    { color: 'var(--white)', suffix: 'Uhr', not: 'Keine Zeit' },
    { color: '#d4be21', suffix: '', not: 'Kein Rabatt' },
    { color: '#2fd159', suffix: 'Jahre', not: 'Kein Alter' },
  ];

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
    const { list: ageList } = getQuestFormValue(status.day, structureFields?.find((x) => x.name === 'age')?.answers, []);
    const { list: timeList } = getQuestFormValue(status.day, structureFields?.find((x) => x.name === 'time')?.answers, ['']);

    const rowList: (string | false)[][] = [];

    timeList.forEach((time) => {
      [...discountList, ...ageList].forEach((disc: string) => {
        rowList.push([time || false, disc || false || false]);
      });
    });

    setStatus({ ...status, hasTime: !!timeList[1] });

    return rowList;
  };

  const generateRows = () => {
    if (priceList !== false) {
      const rowNames: (string | false)[][] = generateRowNames();

      const rowValues: PriceRows[] = rowNames.map((row: (string | false)[]) => {
        const priceValues = columns.map(([persons, duration]: [number, number]) => (
          priceList?.find((p: PriceItem) => p.id === `${row.filter(Boolean).join('_')}_${persons}_${duration}_${status.day}`)?.price || 0.00
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
      const foundation: string = structure?.foundation || 'person';

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

  const loadPrices = () => {
    console.log('Tag:', status.day);
    getFireCollection(`activities/${activityID}/services/${serviceID}/prices`, false, [['day', '==', status.day]])
      .then((data: any[]) => setPriceList(data || []));
  };

  const savePrice = (e: any) => {
    if (status.day) {
      const { value, id } = e.target;
      const [cellIndex, rowIndex] = id.split('_');

      const [persons, duration] = columns[cellIndex];
      const [time, discount] = rows[rowIndex].row;
      const getRowList = rows[rowIndex].row.filter(Boolean);
      const rowID = `${getRowList.join('_')}_${persons}_${duration}_${status.day}`;

      const newItem: PriceItem = { id: rowID, duration, persons, price: value, day: status.day, time, discount };
      return fireDocument(`activities/${activityID}/services/${serviceID}/prices/${rowID}`, newItem, 'set').then(() => console.log('gespeichert'));
    }
  };

  const loadStructure = async () => {
    const serviceFieldData = await getFireCollection(`activities/${activityID}/structures/${structure.id}/fields`, false);
    if (serviceFieldData) {
      const days = structure?.days;
      setStatus({ ...status, day: days?.[1] ? undefined : days?.[0] || 'nothing' });
      setStructureFields(serviceFieldData);
    }
  };

  const daySelect = async () => {
    checkDuration();
    loadPrices();
  };

  useEffect(() => { generateColumns(); }, [durationList]);
  useEffect(() => { if (priceList) generateRows(); }, [priceList]);
  useEffect(() => { loadStructure(); }, []); // initial load
  useEffect(() => { if (status.day) daySelect(); }, [status.day]);

  const handleFocus = (e: any) => e.target.select();

  const editCurrentFields = () => {
    if (structureFields) editStructure(structureFields, 'structure');
  };

  return (
    <Fragment>
      <h1 style={{ marginBottom: '20px' }}>Preis-Tabelle anpassen</h1>

      {structure?.days?.[1] && questionLength === structureFields?.length && (
      <SelectInput
        label="Wähle eine Tagesgruppe"
        name="day"
        icon={<Calendar />}
        options={structure.days || []}
        error={status.day ? 'valid' : 'invalid'}
        change={changeDay}
        value={status.day}
      />
      )}

      {questionLength === structureFields?.length ? (
        <Fragment>
          <Chip small type="grey" label="Verwendete Tabelle bearbeiten" action={editCurrentFields} />
          <Chip small type="delete" label="Verwendete Tabelle entfernen" action={() => editStructure(undefined, 'belongs')} />

          {status.day && (
          <Fragment>
            <table class={`${style.table} ${style.prices} ${status.hasTime ? style.time : ''}`} style={{ margin: '0 0 20px 0' }}>
              <thead>
                <tr>
                  {status.hasTime && <th>Uhrzeit</th>}
                  <th style={{ padding: '5px 0' }}>Rabatte</th>
                  {columns?.map(([persons, duration]: [number, number]) => <th>{persons} Pers. für {structure.duration === 'round' ? '1 Runde' : `${duration} Min.`}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((row: PriceRows, rowIndex: number) => (
                  <tr>
                    {status.hasTime && <td>{(rowIndex === 0 || rows[rowIndex - 1].row[0] !== row.row[0]) ? row.row[0] || 'Standartpreis' : 's.o.'}</td>}
                    <td>{row.row.map((x: string | false, i: number) => (!status.hasTime || i > 0) && <span style={{ color: rowProps[i].color }}>{x ? `${x} ${rowProps[i].suffix}` : rowProps[i].not}</span>)}</td>
                    {row.columns?.map((price: number, cellIndex: number) => (
                      <td><input id={`${cellIndex}_${rowIndex}`} value={price} type="number" onFocus={handleFocus} onChange={savePrice} min="0.00" max="10000.00" step="1" placeholder="-" /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <FormButton label="Preise speichern & schließen" action={() => changeDay(undefined)} />
          </Fragment>
          )}
          {/* <Item icon={<Info />} type="info" label="Wenn kein Preis angegeben ist, wird der Standartpreis verwendet." text="Für die Berechnung ist ein Preis oder Standart-Preis erforderlich" /> */}

        </Fragment>
      ) : (
        <Item icon={<Edit color="var(--orange)" />} label="Tabelle jetzt abschließen" type="info" text="Sie müssen die Vorlage abschließen um fortzufahren" action={editCurrentFields} />
      )}

    </Fragment>
  );
};

export default EditPrices;
