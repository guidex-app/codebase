import { IconLock, IconPlus, IconToggleLeft } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import BackButton from '../../components/backButton';
import FilterList from '../../components/filter';
import TextHeader from '../../components/iconTextHeader';
import Item from '../../components/item';
import Spinner from '../../components/spinner';
import Modal from '../../container/modal';
import catFilter from '../../data/catFilter';
import { getFireCollection } from '../../data/fire';
import Edit from './edit';

const Admin: FunctionalComponent = () => {
  const [list, setList] = useState<any[]>([]);
  const [type, setType] = useState<'catInfos' | 'topics'>('catInfos');
  const [item, setItem] = useState<any | false | undefined>(false);
  const [openFilter, setOpenFilter] = useState(false);

  const fetchList = async () => {
    const categories: any = await getFireCollection(type, false);
    if (categories) setList(categories);
  };

  const updateData = (data: any, filter?: boolean) => {
    const findIndex = list.findIndex((x) => x.title.form === data.title?.form);

    if (filter) {
      setOpenFilter(true);
      return setItem({ ...item, ...data });
    }

    if (item === undefined && findIndex === -1) {
      setList([data, ...list]);
    } else if (findIndex > -1) {
      const newList = list;
      newList.slice(findIndex, 1);
      setList(newList);
    }

    return setItem(false);
  };

  const updateFilter = (newFilter: string[]) => {
    if (item) setItem({ ...item, filter: newFilter });
  };

  useEffect(() => { fetchList(); }, [type]);

  return (
    <Fragment>
      <BackButton title="Startseite" url="/" />
      <TextHeader icon={<IconLock color="#fea00a" />} title={`${type === 'catInfos' ? 'Kategorien' : 'Topics'}`} text="Verwalte die Kategorien oder die Topics" />
      <main class="small_size_holder">
        <Item icon={<IconToggleLeft />} label={`${type === 'catInfos' ? 'Topics' : 'Kategorien'} anzeigen`} type="grey" action={() => setType(type === 'catInfos' ? 'topics' : 'catInfos')} />
        <Item icon={<IconPlus color="var(--orange)" />} label={`${type === 'catInfos' ? 'Kategorie' : 'Topic'} Hinzufügen`} type="info" action={() => setItem(undefined)} />

        {list[0] ? list.map((x) => (
          <Item key={x.title.form} label={x.title.name} image={`https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/${type === 'topics' ? 'topics' : 'categories'}%2F${x.title.form}%2F${x.title.form}_250x200`} action={() => setItem(x)} />
        )) : <Spinner />}

        {item !== false && openFilter && <Modal title={item?.title?.name || ''} close={() => setOpenFilter(false)}><FilterList data={catFilter} values={item.filter} change={updateFilter} close={() => setOpenFilter(false)} /></Modal>}
        {item !== false && !openFilter && <Modal title={item?.title?.name || ''} close={() => setItem(false)}><Edit data={item} type={type} close={updateData} /></Modal>}
      </main>
    </Fragment>
  );
};

export default Admin;
