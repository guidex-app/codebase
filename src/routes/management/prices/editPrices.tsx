import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import SelectInput from '../../../components/form/selectInput';
import { fireDocument, getFireCollection } from '../../../data/fire';
import getQuestFormValue from '../../../helper/priceStructure';
import { ServiceField } from '../../../interfaces/company';

import style from '../../../style/table.module.css';

interface EditPricesProps {
    structure: ServiceField[];
    collection: string;
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

const EditPrices: FunctionalComponent<EditPricesProps> = ({ structure, collection }: EditPricesProps) => {
  const [day, setDay] = useState<string>();
  const [dayList] = useState<string[]>(structure.find((x) => x.name === 'days')?.answers?.[0].values || []);
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
    const getFound = structure.find((x) => x.name === 'foundation');
    if (getFound?.name === 'objectPriceGroup') {
      foundation = getQuestFormValue(day, getFound.answers, []).list?.[0] || 'persPrice';
    } else {
      foundation = getFound?.answers?.[0].name || 'persPrice';
    }
    return foundation;
  };

  const generateRowNames = () => {
    const { list: discountList } = getQuestFormValue(day, structure.find((x) => x.name === 'discounts')?.answers, ['']);
    const { list: ageList } = getQuestFormValue(day, structure.find((x) => x.name === 'age')?.answers, ['']);
    const { list: timeList } = getQuestFormValue(day, structure.find((x) => x.name === 'time')?.answers, ['']);

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

      console.log(prices);
      const rowValues: PriceRows[] = rowNames.map((row: string[]) => {
        const rowID = row.toString();
        const getColumns = columns.map((col: string) => (prices?.find((p) => p.row === rowID && col.toString() === p.col)?.value || 0.00));
        return { name: row, columns: getColumns };
      });

      setRows(rowValues);
    }
  };

  const generateColumns = () => {
    if (day) {
      const newColumns: string[] = [];

      const { list: personList } = getQuestFormValue(day, structure.find((x) => x.name === 'persons')?.answers, ['1']);
      const foundation: string = getFoundation();

      personList.forEach((p: string) => durationList.forEach((d: string) => {
        const text: string = foundation === 'objectPrice' ? `1 Raum (${generateTableNames(p, d)})` : generateTableNames(p, d);
        newColumns.push(text);
      }));

      setColumns(newColumns);
    }
  };

  const checkDuration = () => {
    if (day) {
      const roundDiscountList = ['1'];
      const { list: newDurationList, isRound = false } = getQuestFormValue(day, structure.find((x) => x.name === 'duration')?.answers);
      if (isRound) {
        const { list: roundDiscount } = getQuestFormValue(day, structure.find((x) => x.name === 'roundDiscount')?.answers);
        roundDiscountList.push(...roundDiscount);
      }
      setIsRoundValue(isRound);
      console.log(structure.find((x) => x.name === 'duration'));
      console.log(newDurationList);
      setDurationList(isRound ? roundDiscountList : newDurationList);
    }
  };

  const loadPrices = () => {
    if (day) {
      getFireCollection(`${collection}/prices`, false, [['onDay', '==', day]]).then((data: any[]) => {
        setPrices(data || undefined);
      });
    }
  };

  const savePrice = (e: any) => {
    if (day) {
      const { value, id } = e.target;
      const [row, col] = id.split('_');
      const newItem: PriceItem = { row, col, value: +value, onDay: day };
      fireDocument(`${collection}/prices/${id}`, newItem, 'set').then(() => console.log('gespeichert'));
    }
  };

  useEffect(() => {
    checkDuration();
    loadPrices();
  }, [day]);
  useEffect(() => { generateColumns(); }, [durationList]);
  useEffect(() => { generateRows(); }, [prices]);

  return (
    <div style={{ padding: '10px' }}>
      <SelectInput
        label="Wähle eine Tagesgruppe"
        name="day"
        options={dayList || []}
        error={day ? 'valid' : 'invalid'}
        change={changeDay}
        value={day}
      />
      <p class="grey">Wenn Sie keinen Preis angegeben haben, wird der zugrunde liegende Standartpreis verwendet.</p>
      {day ? (
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
      ) : (
        <p class="red">Wähle eine Tagesgruppe, um die Preise anzupassen.</p>
      )}
    </div>
  );
};

export default EditPrices;
