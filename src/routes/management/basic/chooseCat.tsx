import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Book, Info, Layers } from 'react-feather';

import SelectInput from '../../../components/form/selectInput';
import Item from '../../../components/item';
import { getFireCollection } from '../../../data/fire';
import { CatInfo } from '../../../interfaces/categorie';

interface ActivityProps {
    currentCat?: string;
    disabled: boolean;
    changeCat: (cat?: CatInfo) => void;
}

const ChooseCat: FunctionalComponent<ActivityProps> = ({ currentCat, disabled, changeCat }: ActivityProps) => {
  const [selected, setSelected] = useState<{ belongs?: string, secondary?: string }>({ belongs: undefined, secondary: undefined });
  const [hasSecondary, setHasSecondary] = useState<boolean>(false);
  const [list, setList] = useState<{ belongs: string[], secondary: string[] }>({ belongs: [], secondary: [] });
  const [catInfos, setCatInfos] = useState<CatInfo[]>([]);

  const loadCatInfos = async () => {
    const catInfoList = await getFireCollection('catInfos', false);
    if (catInfoList) {
      const belongs: string[] = [];

      catInfoList.forEach((x) => {
        if (!x.belongsTo && x.title.name && !belongs.includes(x.title.name)) {
          belongs.push(x.title.name);
        } else if (x.belongsTo && !belongs.includes(x.belongsTo)) {
          belongs.unshift(x.belongsTo);
        }

        if (currentCat === x.title.name) {
          if (x.belongsTo) setHasSecondary(true);
          setSelected({ belongs: x.belongsTo || currentCat, secondary: x.belongsTo ? x.title.name : undefined });
        }
      });

      setList({ ...list, belongs });
      setCatInfos(catInfoList);
    }
  };

  const getCatInfo = (name: string) => changeCat(catInfos.find((x) => x.title.name === name));

  const changeBelongs = (value: string) => {
    setSelected({ ...selected, belongs: value });

    const secondaryList: string[] = [];
    catInfos.forEach((cat: CatInfo) => {
      if (cat.belongsTo === value) secondaryList.push(cat.title.name);
    });

    setHasSecondary(!!secondaryList[0]);
    if (!secondaryList[0]) return getCatInfo(value);
    if (selected.belongs !== value && selected.secondary) changeCat(undefined);

    setList({ ...list, secondary: secondaryList });
  };

  const changeSecondary = (value: string) => {
    setSelected({ ...selected, secondary: value });
    getCatInfo(value);
  };

  useEffect(() => { loadCatInfos(); }, []);

  return (
    <Fragment>

      <SelectInput
        label="Kategorie"
        name="mainCat"
        placeholder="Ordnen Sie sich einer Kategorie zu"
        icon={<Book color="#fea00a" />}
        value={selected.belongs}
        options={list.belongs}
        error={selected.belongs ? 'valid' : 'invalid'}
        disabled={disabled}
        required
        change={changeBelongs}
      />

      {hasSecondary && (
        <SelectInput
          label={`Welche Art von "${selected.belongs}"`}
          name="category"
          placeholder="Ordnen Sie sich einer Unterkategorie zu"
          icon={<Layers color="#fea00a" />}
          value={selected.secondary}
          options={list.secondary}
          disabled={disabled}
          error={selected.secondary ? 'valid' : 'invalid'}
          required
          change={changeSecondary}
        />
      )}

      {disabled && <Item icon={<Info color="var(--red)" />} label="Die Kategorie-Auswahl ist deaktiviert" text="Um die Kategorie zu ändern, muss die Unternehmung offline gestellt sein" />}

    </Fragment>
  );
};

export default ChooseCat;
