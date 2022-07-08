import { IconCalendar, IconEditCircle, IconInfoCircle } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import FormButton from '../../../components/form/basicButton';
import SelectInput from '../../../components/form/Inputs/select';
import Item from '../../../components/item';
import TopButton from '../../../components/topButton';
import { fireDocument, getFireCollection } from '../../../data/fire';
import getQuestFormList from '../../../helper/priceStructure';
import { ServiceField } from '../../../interfaces/company';
import { PriceItem } from '../../../interfaces/reservation';
import style from '../../../style/table.module.css';

interface EditPricesProps {
    structure?: ServiceField[];
    activityID: string;
    serviceID: string;
    questionLength: number;
    openingDays: string[];
    editStructure: (field: ServiceField[] | undefined, showType: 'belongs' | 'structure') => void;
}

interface PriceRows {
    row: (string | false)[];
    columns: number[];
}

const EditPrices: FunctionalComponent<EditPricesProps> = ({ structure, activityID, openingDays, serviceID, questionLength, editStructure }: EditPricesProps) => {
  const [status, setStatus] = useState<{
    isRound?: boolean;
    hasTime?: boolean;
    foundation?: string;
    rowCount?: number;
    day?:(string);
      }>({});

  // listen
  const [durationList, setDurationList] = useState<string[]>([]);
  const [roundDiscount, setRoundDiscount] = useState<string[]>([]);
  const [dayGroups, setDayGroups] = useState<string[]>([]);

  // tabelle
  const [columns, setColumns] = useState<[string, string][]>([]);
  const [rows, setRows] = useState<PriceRows[]>([]); // cell array in a row array
  const [priceList, setPriceList] = useState<PriceItem[] | false | undefined>(false); // cell array in a row array
  const colorMap = ['#46244C', '#712B75', '#C74B50', '#D49B54', '#A05344', '#734046', '#321F28'];

  // farben
  const rowProps = [
    { suffix: 'Uhr', not: 'Keine Zeit' },
    { suffix: '', not: 'Kein Rabatt' },
    { suffix: 'Jahre', not: 'Kein Alter' },
  ];

  const changeDay = (value: any) => {
    if (value === status.day) return;
    setStatus({ ...status, day: value });
    setPriceList(false);
  };

  const generateRowNames = () => {
    if (!structure) return [];

    const { list: discountList } = getQuestFormList(status.day, structure?.find((x) => x.name === 'discounts')?.selected, ['']);
    const { list: ageList } = getQuestFormList(status.day, structure?.find((x) => x.name === 'age')?.selected, []);
    const { list: timeList } = getQuestFormList(status.day, structure?.find((x) => x.name === 'time')?.selected, ['']);

    const rowList: (string | false)[][] = [];
    const specs = [...discountList, ...ageList];
    const rowCount: number = specs.length;

    timeList.forEach((time) => {
      specs.forEach((disc: string) => {
        rowList.push([time || false, disc || false || false]);
      });
    });

    setStatus({ ...status, hasTime: !!timeList[1], rowCount });

    return rowList;
  };

  const generateRows = () => {
    if (priceList === false) return;

    const rowNames: (string | false)[][] = generateRowNames();

    const rowValues: PriceRows[] = rowNames.map((row: (string | false)[]) => {
      const priceValues = columns.map(([persons, duration]: [string, string]) => (
        priceList?.find((p: PriceItem) => p.id === `${row.filter(Boolean).join('_')}_${persons}_${duration}_${status.day}`)?.price || 0.00
      ));
      return { row, columns: priceValues };
    });

    setRows(rowValues);
  };

  const generateColumns = () => {
    if (!status.day) return;

    const newColumns: [string, string][] = [];

    const { list: personList } = getQuestFormList(status.day, structure?.find((x) => x.name === 'persons')?.selected, ['Ab 1']);
    // const generatePersonGroups = structure?.find((x) => x.name === 'persons')?.selected?.values.
    const { list: foundation } = getQuestFormList(status.day, structure?.find((x) => x.name === 'foundation')?.selected, ['person'], true);

    personList.forEach((person: string) => [...(status.isRound ? roundDiscount : durationList)].forEach((roundDuration: string) => {
      newColumns.push([person, roundDuration]);
    }));

    setColumns(newColumns);
    setStatus({ ...status, foundation: foundation[0] });
  };

  const checkDuration = () => {
    const { list: newDurationList, isRound = false } = getQuestFormList(status.day, structure?.find((x) => x.name === 'duration')?.selected);
    if (isRound) {
      const { list: roundDiscountList } = getQuestFormList(status.day, structure?.find((x) => x.name === 'roundDiscount')?.selected);

      setRoundDiscount(['ab 1', ...roundDiscountList]);
    }

    setStatus({ ...status, isRound });
    setDurationList(newDurationList);
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
      console.log(duration);

      const newItem: PriceItem = { id: rowID, duration: status.isRound ? +durationList[0] : +duration, persons, price: +value, day: status.day, time, roundDiscount: duration === 'für 1' || duration === 'ab 1' ? false : duration, discount };
      return fireDocument(`activities/${activityID}/services/${serviceID}/prices/${rowID}`, newItem, 'set').then(() => console.log('gespeichert'));
    }
  };

  const generateDayGroups = () => {
    const allGroups: string[][] = []; // Hier sind alle Gruppen die existieren drinne
    const unUsedDays: string[] = openingDays; // Unbenutzte Tage (Anhand der Öffnungszeiten)
    const einzelneTage: string[] = []; // Hier werden bereits einzelne Tage gespeichert

    structure?.forEach((x: ServiceField) => {
      if (x.selected?.values) {
        x.selected.values.forEach((element) => {
          if (element.onDays && !allGroups.some((v) => v.toString() === element.onDays?.toString())) { // hier werden noch doppelte gruppen hinzugefügt
            allGroups.push(element.onDays);
            if (element.onDays.length === 1) {
              einzelneTage.push(element.onDays[0]);
              unUsedDays.splice(unUsedDays.indexOf(element.onDays[0]), 1);
            }
          }
        });
      }
    });

    const uniqeGroups: string[][] = []; // Hier werden die finalen Gruppen gespeichert
    ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].forEach((day: string) => {
      if (unUsedDays.includes(day)) {
        const alleAngelegten: string[][] = [];
        const alleMitTag: string[] = [];

        allGroups.forEach((x) => {
          if (x.includes(day)) {
            alleAngelegten.push(x);
            x.forEach((y) => {
              if (!alleMitTag.includes(y) && unUsedDays.includes(y)) alleMitTag.push(y);
            });
          }
        });

        const splitted: string[] = [];
        alleMitTag.forEach((x: string) => {
          if (unUsedDays.includes(x)) {
            const isInAllGroups = alleAngelegten.every((g) => g.includes(x));
            const otherIsInOther = allGroups.some((l) => l.includes(x) && alleAngelegten.findIndex((f) => f.toString() === l.toString()) === -1);
            if (isInAllGroups && !otherIsInOther) {
              splitted.push(x);
              unUsedDays.splice(unUsedDays.indexOf(x), 1);
            }
          }
        });

        if (splitted[0]) uniqeGroups.push(splitted);
      }
    });

    if (unUsedDays[0]) uniqeGroups.push(unUsedDays);

    const newGroups: string[] = uniqeGroups.map((x) => x.join(', '));

    setDayGroups([...newGroups, ...einzelneTage]);
    return setStatus({ ...status, day: newGroups?.[1] ? undefined : newGroups?.[0] || 'nothing' });
  };

  const daySelect = async () => {
    checkDuration();
    loadPrices();
  };

  useEffect(() => { generateColumns(); }, [durationList]);
  useEffect(() => { if (priceList !== false) generateRows(); }, [priceList]);
  useEffect(() => { generateDayGroups(); }, [structure]); // initial load
  useEffect(() => { if (status.day) daySelect(); }, [status.day]);

  const handleFocus = (e: any) => e.target.select();

  const editCurrentFields = () => {
    editStructure(structure, 'structure');
  };

  // if (structureFields === false) {
  //   return (
  //     <h1 style={{ marginBottom: '20px' }}>Preise bearbeiten</h1>
  //   );
  // }
  console.log(rows);

  return (
    <Fragment>
      <h1>Preise bearbeiten</h1>
      <p style={{ color: 'var(--fifth)', marginTop: '5px' }}>Passe Deine Preise an. Wenn du bereits eine Leistung mit einer ähnlichen konfiguration angelegt hast, nutze unseren export bereich.</p>

      {!status.day && (
        <section class="group form">
          {questionLength === ((structure && structure.length) || 0) ? (
            <Item icon={<IconEditCircle />} type="grey" label="Tabelle bearbeiten (7 Schritte)" text="Die Gruppen werden anhand der angegebenen Werte automatisch von Guidex generiert. Bei Änderungen werden schon angegbene Preise evtl. verworfen." action={editCurrentFields} />
          ) : (
            <Item icon={<IconEditCircle />} type="grey" label="Tabelle abschließen (7 Schritte)" text="Sie müssen die Vorlage abschließen um fortzufahren" action={editCurrentFields} />
          )}

          {questionLength === ((structure && structure.length) || 0) && dayGroups.map((x) => <Item type="clean" icon={<IconCalendar color="#bf5bf3" />} editLabel="Mit Preiseingabe beginnen" label={x} action={() => changeDay(x)} />)}

          {/* <Item type="warning" label="Verwendete Tabelle entfernen" action={() => editStructure(undefined, 'belongs')} /> */}

        </section>
      )}

      {status.day && (
        <Fragment>
          <TopButton title="Zurück" action={() => changeDay('')} />
          {dayGroups[1] && (
          <SelectInput
            label="Gruppe wechseln"
            name="day"
            icon={<IconCalendar />}
            options={dayGroups || []}
            error={status.day ? 'valid' : 'invalid'}
            change={changeDay}
            value={status.day}
          />
          )}

          {/* <Item type="info" icon={<IconInfoCircle color="var(--orange)" />} label="Lasse Felder frei, welche nicht für den Nutzer verfügbar sein sollen" /> */}
          <Item type="info" icon={<IconInfoCircle color="var(--orange)" />} label={`Bitte beachten Sie: Der Preis muss immer einheitlich pro Person${status.isRound ? '/pro Runde' : ''} angegeben werden.`} text="Sollte eine Konstellation nicht existieren, lassen Sie das Feld Bitte frei" />
          {status.day && priceList === false && <table class={`${style.table} ${style.heading}`} style={{ margin: '0 0 20px 0' }}><thead><tr><th>&nbsp;</th></tr></thead><tbody><tr><td>Preise werden geladen...</td></tr></tbody></table>}
          {status.day && priceList !== false && (
          <Fragment>
            <table class={`${style.table} ${style.prices} ${status.hasTime ? style.time : ''}`} style={{ margin: '0 0 20px 0' }}>
              <thead>
                <tr class={style.heading}>
                  {status.hasTime && <th>Uhrzeit</th>}
                  <th style={{ width: '170px' }}>Rabatte</th>
                  {columns?.map(([persons, duration]: [string, string]) => <th>{status.isRound && <small style={{ backgroundColor: 'var(--orange)', color: 'var(--dark)' }}>Rundenpreis</small>} {persons === 'Ab 1' ? '' : `${persons} Pers.`} {status.isRound ? ' ' : ' für '}{duration === 'ab 1' ? '' : duration} {status.isRound ? `${duration === 'ab 1' ? '' : 'Runde(n)'}` : 'Min.'}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((row: PriceRows, rowIndex: number) => (
                  <tr style={{ backgroundColor: colorMap[Math.floor(rowIndex / (status.rowCount || 1))], borderTop: ((rowIndex / (status.rowCount || 1)) % 1) === 0 && rowIndex !== 0 ? '2px solid #1a1a1a' : 'none' }}>
                    {status.hasTime && (rowIndex === 0 || rows[rowIndex - 1].row[0] !== row.row[0]) && <td rowSpan={status.rowCount || 1} style={{ width: '150px' }}>{row.row[0] || 'Standartpreis'}</td>}
                    <td class={style.dark}>{row.row.map((x: string | false, i: number) => (!status.hasTime || i > 0) && <span style={{ backgroundColor: colorMap[Math.floor(rowIndex / (status.rowCount || 1))] }}>{x ? `${x} ${rowProps[i].suffix}` : rowProps[i].not}</span>)}</td>
                    {row.columns?.map((price: number, cellIndex: number) => (
                      <td class={style.input} title={status.isRound ? 'pro Person/pro Runde' : 'pro Person'}><input id={`${cellIndex}_${rowIndex}`} value={price} type="number" onFocus={handleFocus} onChange={savePrice} min="0.00" max="10000.00" step="1" placeholder="-" /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div class={style.footer}>
              <small>Der Preis wird immer pro Person{status.isRound ? '/pro Runde' : ''} angegeben</small>
            </div>
            <FormButton label="Preise speichern & schließen" action={() => changeDay(undefined)} />
          </Fragment>
          )}
        </Fragment>
      )}

    </Fragment>
  );
};

export default EditPrices;
