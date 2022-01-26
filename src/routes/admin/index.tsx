import { Fragment, FunctionalComponent, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Lock, PlusCircle, ToggleLeft } from 'react-feather';
import FilterList from '../../components/filter';
import Item from '../../components/item';
import TextHeader from '../../components/iconTextHeader';
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
    if (filter) {
      setOpenFilter(true);
      setItem({ ...item, ...data });
    } else {
      const findIndex = list.findIndex((x) => x.title.form === item.title.form);
      if (findIndex !== -1) {
        const newList = list;
        newList.slice(findIndex, 1);
        setList(newList);
      } else {
        setList([...list, data]);
      }
    }
  };

  useEffect(() => {
    fetchList();
  }, [type]);

  return (
    <Fragment>
      <TextHeader icon={<Lock color="#fea00a" />} title="Admin" text="Verwalte die Kategorien oder die Topics" />
      <main class="small_size_holder">
        <Item icon={<ToggleLeft />} label={`${type === 'catInfos' ? 'Topics' : 'Kategorien'} anzeigen`} type="grey" action={() => setType(type === 'catInfos' ? 'topics' : 'catInfos')} />
        <Item icon={<PlusCircle />} label="Hinzufügen" action={() => setItem(undefined)} />
        {list.map((x) => (
          <Item key={x.title.form} label={x.title.name} image={`https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/${type === 'topics' ? 'topics' : 'categories'}%2F${x.title.form}%2F${x.title.form}_250x200`} action={() => setItem(x)} />
        ))}

        {item !== false && openFilter && <Modal title={item?.title?.name || ''} close={() => setOpenFilter(false)}><FilterList data={catFilter} values={item.filter} /></Modal>}
        {item !== false && !openFilter && <Modal title={item?.title?.name || ''} close={() => setItem(false)}><Edit data={item} type={type} close={updateData} /></Modal>}
      </main>
    </Fragment>
  );
};

export default Admin;
