import { IconCalendar, IconEdit } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

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
  const [durationList, setDurationList] = useState<string[]>([]);
  const [dayGroups, setDayGroups] = useState<string[]>([]);

  // tabelle
  const [columns, setColumns] = useState<[number, number][]>([]);
  const [rows, setRows] = useState<PriceRows[]>([]); // cell array in a row array
  const [priceList, setPriceList] = useState<PriceItem[] | false | undefined>(false); // cell array in a row array
  const [structureFields, setStructureFields] = useState<ServiceField[] | false | undefined>(false);

  // farben
  const rowProps = [
    { color: 'var(--white)', suffix: 'Uhr', not: 'Keine Zeit' },
    { color: '#d4be21', suffix: '', not: 'Kein Rabatt' },
    { color: '#2fd159', suffix: 'Jahre', not: 'Kein Alter' },
  ];

  const changeDay = (value: any) => {
    setStatus({ ...status, day: value });
    setPriceList(false);
  };

  const generateRowNames = () => {
    if (!structureFields) return [];

    const { list: discountList } = getQuestFormValue(status.day, structureFields?.find((x) => x.name === 'discounts')?.selected, ['']);
    const { list: ageList } = getQuestFormValue(status.day, structureFields?.find((x) => x.name === 'age')?.selected, []);
    const { list: timeList } = getQuestFormValue(status.day, structureFields?.find((x) => x.name === 'time')?.selected, ['']);

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
    if (priceList === false) return;

    const rowNames: (string | false)[][] = generateRowNames();

    const rowValues: PriceRows[] = rowNames.map((row: (string | false)[]) => {
      const priceValues = columns.map(([persons, duration]: [number, number]) => (
        priceList?.find((p: PriceItem) => p.id === `${row.filter(Boolean).join('_')}_${persons}_${duration}_${status.day}`)?.price || 0.00
      ));
      return { row, columns: priceValues };
    });

    setRows(rowValues);
  };

  const generateColumns = () => {
    if (!status.day || structureFields === false) return;

    const newColumns: [number, number][] = [];

    const { list: personList } = getQuestFormValue(status.day, structureFields?.find((x) => x.name === 'persons')?.selected, ['1']);
    const { list: foundation } = getQuestFormValue(status.day, structureFields?.find((x) => x.name === 'foundation')?.selected, ['person'], true);

    personList.forEach((person: string) => durationList.forEach((duration: string) => {
      // const text: string = foundation === 'object' ? `1 Raum (${getColumnName(p, d)})` : getColumnName(p, d);
      newColumns.push([+person, +duration]);
    }));

    setColumns(newColumns);
    setStatus({ ...status, foundation: foundation[0] });
  };

  const checkDuration = () => {
    if (structureFields === false) return;
    const roundDiscountList = ['1'];
    const { list: newDurationList, isRound = false } = getQuestFormValue(status.day, structureFields?.find((x) => x.name === 'duration')?.selected);
    if (isRound) {
      const { list: roundDiscount } = getQuestFormValue(status.day, structureFields?.find((x) => x.name === 'roundDiscount')?.selected);
      roundDiscountList.push(...roundDiscount);
    }

    setStatus({ ...status, isRound });
    setDurationList(isRound ? roundDiscountList : newDurationList);
  };

  const loadPrices = async () => {
    try {
      const loadedPrices = await getFireCollection(`activities/${activityID}/services/${serviceID}/prices`, false, [['day', '==', status.day]]);
      setPriceList(loadedPrices || []);
    } catch {
      setPriceList([]);
    }
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

  /**
   * LEISTUNG:
   * Alter: (Mo, Di, Mi, Do) & (Mi, Do)
   * Foundation: ALLE
   * Dauer: (Do, Mi) & (Mo)
   * Rabatt: Mo, Di, Do
   *
   * FOLGENDE GRUPPEN
   * Nur 1 Tag: Mo, Do
   */

  const generateDayGroups = (fields: ServiceField[]): string[] => {
    const allGroups: string[][] = [];
    const usedDays: string[] = [];
    const einzelneTage: string[] = [];

    fields.forEach((x: ServiceField) => {
      if (x.selected?.values) {
        x.selected.values.forEach((element) => {
          if (element.onDays && !allGroups.some((v) => v.toString() === element.onDays?.toString())) { // hier werden noch doppelte gruppen hinzugefügt
            allGroups.push(element.onDays);
            if (element.onDays.length === 1) {
              einzelneTage.push(element.onDays[0]);
              usedDays.push(element.onDays[0]);
            }
          }
        });
      }
    });
    console.log('ALLE', allGroups);

    const uniqeGroups: string[][] = [];
    ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].forEach((day: string) => {
      if (!usedDays.includes(day)) {
        const alleAngelegten: string[][] = [];
        const alleMitTag: string[] = [];

        allGroups.forEach((x) => {
          if (x.includes(day)) {
            alleAngelegten.push(x);
            x.forEach((y) => {
              if (!alleMitTag.includes(y) && !usedDays.includes(y)) alleMitTag.push(y);
            });
          }
        });

        const splitted: string[] = [];
        alleMitTag.forEach((x: string) => {
          if (!usedDays.includes(x)) {
            const isInAllGroups = alleAngelegten.every((g) => g.includes(x));
            const otherIsInOther = allGroups.some((l) => l.includes(x) && alleAngelegten.findIndex((f) => f.toString() === l.toString()) === -1);
            if (isInAllGroups && !otherIsInOther) {
              splitted.push(x);
              usedDays.push(x);
            }
          }
        });

        if (splitted[0]) uniqeGroups.push(splitted);
      }
    });

    if (usedDays.length !== 7) uniqeGroups.push(['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].filter((d) => !usedDays.includes(d)));

    // 1. Wenn etwas nur für einen Tag definiert wurde, muss der Tag einzelnt erstellt werden
    // 2. Wenn eine Gruppe nicht immer gemeinsam auftritt muss jeder Tag einzelnt erstellt werden.
    const newGroups: string[] = uniqeGroups.map((x) => x.join(', '));
    setDayGroups([...newGroups, ...einzelneTage]);
    console.table([...newGroups, ...einzelneTage]);
    return newGroups;
  };

  const loadStructureFields = async () => {
    try {
      const serviceFieldData = await getFireCollection(`activities/${activityID}/structures/${structure.id}/fields`, false);
      if (serviceFieldData[0]) {
        const days = generateDayGroups(serviceFieldData);
        setStatus({ ...status, day: days?.[1] ? undefined : days?.[0] || 'nothing' });
        setStructureFields(serviceFieldData || []);
      }
    } catch {
      setStructureFields([]);
    }
  };

  const daySelect = async () => {
    checkDuration();
    loadPrices();
  };

  useEffect(() => { generateColumns(); }, [durationList]);
  useEffect(() => { if (priceList !== false) generateRows(); }, [priceList]);
  useEffect(() => { loadStructureFields(); }, []); // initial load
  useEffect(() => { if (status.day) daySelect(); }, [status.day]);

  const handleFocus = (e: any) => e.target.select();

  const editCurrentFields = () => {
    if (structureFields) editStructure(structureFields, 'structure');
  };

  if (structureFields === false) {
    return (
      <h1 style={{ marginBottom: '20px' }}>Preis-Tabelle anpassen</h1>
    );
  }

  return (
    <Fragment>
      <h1 style={{ marginBottom: '20px' }}>Preis-Tabelle anpassen</h1>

      {dayGroups[1] && questionLength === structureFields?.length && (
        <SelectInput
          label="Wähle eine Tagesgruppe"
          name="day"
          icon={<IconCalendar />}
          options={dayGroups || []}
          error={status.day ? 'valid' : 'invalid'}
          change={changeDay}
          value={status.day}
        />
      )}

      {questionLength === structureFields?.length ? (
        <Fragment>
          <Chip small type="grey" label="Verwendete Tabelle bearbeiten" action={editCurrentFields} />
          <Chip small type="delete" label="Verwendete Tabelle entfernen" action={() => editStructure(undefined, 'belongs')} />

          {status.day && priceList === false && <table class={`${style.table} ${style.prices}`} style={{ margin: '0 0 20px 0' }}><thead><tr><th>&nbsp;</th></tr></thead><tbody><tr><td>Preise werden geladen...</td></tr></tbody></table>}
          {status.day && priceList !== false && (
          <Fragment>
            <table class={`${style.table} ${style.prices} ${status.hasTime ? style.time : ''}`} style={{ margin: '0 0 20px 0' }}>
              <thead>
                <tr>
                  {status.hasTime && <th>Uhrzeit</th>}
                  <th style={{ padding: '5px 0' }}>Rabatte</th>
                  {columns?.map(([persons, duration]: [number, number]) => <th>{persons} Pers. für {status.isRound ? '1 Runde' : `${duration} Min.`}</th>)}
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
        <Item icon={<IconEdit color="var(--orange)" />} label="Tabelle jetzt abschließen" type="info" text="Sie müssen die Vorlage abschließen um fortzufahren" action={editCurrentFields} />
      )}

    </Fragment>
  );
};

export default EditPrices;
