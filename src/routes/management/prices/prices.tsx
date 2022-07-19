import { IconCalendar, IconInfoCircle } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import FormButton from '../../../components/form/basicButton';
import SelectInput from '../../../components/form/Inputs/select';
import Item from '../../../components/item';
import TopButton from '../../../components/topButton';
import { deleteDocuments, fireDocument, getFireCollection } from '../../../data/fire';
import { getQuestFormData } from '../../../helper/priceStructure';
import { ServiceField } from '../../../interfaces/company';
import { PriceItem } from '../../../interfaces/reservation';
import style from '../../../style/table.module.css';

interface EditPricesProps {
    structure?: ServiceField[];
    activityID: string;
    changed?: Array<'duration' | 'discount' | 'time' | 'persons' | 'roundDiscount'>;
    serviceID: string;
    day: string;
    dayGroups?: string[];
    changeDay: (day: string | undefined) => void;
}

interface PriceRows {
    row: (string | false)[];
    columns: number[];
}

const EditPrices: FunctionalComponent<EditPricesProps> = ({ structure, activityID, serviceID, day, changed, dayGroups, changeDay }: EditPricesProps) => {
  const [status, setStatus] = useState<{ isRound?: boolean; hasTime?: boolean; foundation?: string; rowCount?: number; }>({});

  // listen
  const [durationList, setDurationList] = useState<string[]>([]);
  const [roundDiscountList, setRoundDiscountList] = useState<string[]>([]);

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

  const generateRowNames = () => {
    if (!structure) return [];

    const { discounts, age, time } = getQuestFormData(day, structure, ['discounts', 'age', 'time']);

    // const { list: discountList } = getQuestFormList(day, structure?.find((x) => x.name === 'discounts')?.selected, ['']);
    // const { list: ageList } = getQuestFormList(day, structure?.find((x) => x.name === 'age')?.selected, []);
    // const { list: timeList } = getQuestFormList(day, structure?.find((x) => x.name === 'time')?.selected, ['']);

    const rowList: (string | false)[][] = [];
    const specs = [...discounts, ...age];
    const rowCount: number = specs.length;

    time.forEach((t) => {
      specs.forEach((disc: string) => {
        rowList.push([t || false, disc || false || false]);
      });
    });

    setStatus({ ...status, hasTime: !!time[1], rowCount });

    return rowList;
  };

  const generateRows = () => {
    if (priceList === false) return;

    const rowNames: (string | false)[][] = generateRowNames();

    const rowValues: PriceRows[] = rowNames.map((row: (string | false)[]) => {
      const priceValues = columns.map(([persons, duration]: [string, string]) => (
        priceList?.find((p: PriceItem) => p.id === `${row.filter(Boolean).join('_')}_${persons}_${duration}_${day}`)?.price || 0.00
      ));
      return { row, columns: priceValues };
    });

    setRows(rowValues);
  };

  const generateColumns = () => {
    if (!day || !structure) return;

    const newColumns: [string, string][] = [];

    const { persons, foundation } = getQuestFormData(day, structure, ['persons', 'foundation']);
    // const { list: personList } = getQuestFormList(day, structure?.find((x) => x.name === 'persons')?.selected, ['Ab 1']);
    // const { list: foundation } = getQuestFormList(day, structure?.find((x) => x.name === 'foundation')?.selected, ['person'], true);

    persons.forEach((person: string) => [...(status.isRound ? roundDiscountList : durationList)].forEach((roundDuration: string) => {
      newColumns.push([person, roundDuration]);
    }));

    setColumns(newColumns);
    setStatus({ ...status, foundation: foundation[0] });
  };

  const checkDuration = () => {
    if (!structure) return;
    const { duration, roundDiscount, durationType = [false] } = getQuestFormData(day, structure, ['duration', 'roundDiscount']);
    if (durationType[0] === 'isRound') setRoundDiscountList(['ab 1', ...roundDiscount]);

    setStatus({ ...status, isRound: durationType[0] === 'isRound' });
    setDurationList(duration);
  };

  const loadPrices = async () => {
    try {
      const loadedPrices = await getFireCollection(`activities/${activityID}/services/${serviceID}/prices`, false, [['day', '==', day]]);
      setPriceList(loadedPrices || []);
    } catch {
      setPriceList([]);
    }
  };

  const savePrice = (e: any) => {
    if (day) {
      const { value, id } = e.target;
      const [cellIndex, rowIndex] = id.split('_');

      const [persons, duration] = columns[cellIndex];
      const [time, discount] = rows[rowIndex].row;
      const getRowList = rows[rowIndex].row.filter(Boolean);
      const rowID = `${getRowList.join('_')}_${persons}_${duration}_${day}`;
      console.log(duration);

      const newItem: PriceItem = { id: rowID, duration: status.isRound ? +durationList[0] : +duration, persons, price: +value, day, time, roundDiscount: duration === 'für 1' || duration === 'ab 1' ? false : duration, discount };
      return fireDocument(`activities/${activityID}/services/${serviceID}/prices/${rowID}`, newItem, 'set').then(() => console.log('gespeichert'));
    }
  };

  const daySelect = async () => {
    checkDuration();
    loadPrices();
  };

  const deletePrices = async () => {
    if (!changed?.[0] || !structure || !priceList || priceList?.[0]) return;

    const validValues: { [key:string]: string[] } = getQuestFormData(day, structure, changed);

    const idsToDelete: string[] = [];
    const defaultValues: any = { persons: 'Ab 1', roundDiscount: 'ab 1' };
    priceList.forEach((pri: PriceItem) => {
      if (!pri.id) return;
      const isThere: boolean = changed.some((d) => {
        if (pri[d] === false || (defaultValues[d] && defaultValues[d] === pri[d])) return false;
        return !validValues[d].includes(pri[d].toString());
      });
      if (isThere) idsToDelete.push(pri.id);
    });

    fireDocument(`/activities/${activityID}/services/${serviceID}`, { changed: [] }, 'update');
    deleteDocuments(`/activities/${activityID}/services/${serviceID}/prices`, idsToDelete);
  };

  useEffect(() => { generateColumns(); }, [durationList]);
  useEffect(() => {
    if (priceList !== false) {
      generateRows();
      deletePrices();
    }
  }, [priceList]);

  useEffect(() => { if (day) daySelect(); }, [day]);

  const handleFocus = (e: any) => e.target.select();

  return (
    <Fragment>

      <header style={{ padding: '0 15px' }}>
        <h1>Preise bearbeiten</h1>
        <p style={{ color: 'var(--fifth)', marginTop: '5px' }}>Passe Deine Preise an. Wenn du bereits eine Leistung mit einer ähnlichen konfiguration angelegt hast, nutze unseren export bereich.</p>
      </header>

      {day && (
        <Fragment>
          <TopButton title="Tage" action={() => changeDay(undefined)} />
          {dayGroups?.[1] && (
          <SelectInput
            label="Gruppe wechseln"
            name="day"
            icon={<IconCalendar />}
            options={dayGroups || []}
            error={day ? 'valid' : 'invalid'}
            change={changeDay}
            value={day}
          />
          )}

          {/* <Item type="info" icon={<IconInfoCircle color="var(--orange)" />} label="Lasse Felder frei, welche nicht für den Nutzer verfügbar sein sollen" /> */}
          <Item type="info" icon={<IconInfoCircle color="var(--white)" />} label={`Bitte beachten Sie: Der Preis muss immer einheitlich pro Person${status.isRound ? '/pro Runde' : ''} angegeben werden.`} text="Sollte eine Konstellation nicht existieren, lassen Sie das Feld Bitte frei" />
          {day && priceList === false && <table class={`${style.table} ${style.heading}`} style={{ margin: '0 0 20px 0' }}><thead><tr><th>&nbsp;</th></tr></thead><tbody><tr><td>Preise werden geladen...</td></tr></tbody></table>}
          {day && priceList !== false && (
          <Fragment>
            <table class={`${style.table} ${style.prices} ${status.hasTime ? style.time : ''}`}>
              <thead>
                <tr class={style.heading}>
                  {status.hasTime && <th style={{ backgroundColor: 'black' }}>Uhrzeit</th>}
                  <th style={{ width: '170px', backgroundColor: 'black' }}>Rabatte</th>
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
              <small>Der Preis wird immer <strong>pro Person{status.isRound ? '/pro Runde' : ''}</strong> angegeben</small>
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
