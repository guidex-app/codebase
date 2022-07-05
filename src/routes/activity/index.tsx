import { IconAdjustmentsHorizontal } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import BackButton from '../../components/backButton';
import FabButton from '../../components/fabButton';
import FilterList from '../../components/filter';
import InfoBox from '../../components/form/infoBox/infoBox';
import TextHeader from '../../components/iconTextHeader';
import Item from '../../components/item';
import Modal from '../../container/modal';
import activityFilter from '../../data/activityFilter';
import { getFireCollection, getFireDocument } from '../../data/fire';
import { Activity } from '../../interfaces/activity';
import { Cat } from '../../interfaces/categorie';
import ActivityItem from './activityItem';
import style from './style.module.css';

interface ActivitiesProps {
    categoryID: string;
    day?: string;
    matches?: { l?: 'o' | 'i'; }
}

const ActivityList: FunctionalComponent<ActivitiesProps> = ({ categoryID, day, matches }: ActivitiesProps) => {
  const [category, setCategory] = useState<Cat | undefined>();
  const [list, setList] = useState<Activity[] | undefined | false>(false);
  const [filter, setFilter] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState<'Filtern' | 'addToList' | false>(false);
  const [parameter, setParameter] = useState<{ l?: 'o' | 'i', dayNr: number } | undefined>();

  // const closeModal = () => setOpenModal(false);

  const getActivityList = async () => {
    if (categoryID) {
      const listData = await getFireCollection('activities', false, [['category.form', '==', categoryID], ['state', 'array-contains', 'online']]);
      setList(listData);
    }
  };

  const updateParameters = () => {
    setParameter({ ...matches, dayNr: day ? new Date(day).getDay() : new Date().getDay() });
    if (matches?.l) {
      setFilter([matches.l === 'o' ? 'lo_outdoor' : 'lo_indoor', ...filter]);
    }
  };

  const updateFilter = (newFilter: string[]) => { setFilter(newFilter); };

  const getCategorie = () => {
    if (categoryID) {
      updateParameters();
      getFireDocument(`catInfos/${categoryID}`).then((data: Cat) => {
        if (data.title.form) {
          setCategory(data);
          getActivityList();
        }
      });
    }
  };

  const closeModal = () => setOpenModal(false);
  const openFilter = () => setOpenModal('Filtern');

  useEffect(() => { getCategorie(); }, [categoryID]);

  return (
    <Fragment>
      <BackButton url="/" title="Zurück" />

      <TextHeader
        image={`https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/categories%2F${categoryID}%2F${categoryID}_250x200`}
        title={category?.title.name || ''}
        shorten
        text={category?.description || ''}
      />
      {/* <Item type="large" title={category?.title.name || ''}
        text="Bitte geben Sie hier den Namen Ihrer Unternehmung an z.B. „Lasertag Licht und mehr“.
        Der Name Ihrer Unternehmung ist ihr öffentliches Label" /> */}

      <main style={{ padding: '20px 10px' }} class="size_holder">

        {list === undefined && <Item icon={<InfoBox />} type="info" label="Es wurde nichts in deiner Nähe gefunden" text="Überprüfe deinen Standort oder wähle eine andere Aktivität" />}
        {parameter?.l && <Item type="warning" icon={<IconAdjustmentsHorizontal />} label={`Aufgrund des Wetters werden ${parameter.l === 'o' ? 'Draußen' : 'Drinnen'} Aktivitäten rausgefiltert`} action={openFilter} />}

        <div class={style.list}>
          {list && list?.map((x: Activity) => <ActivityItem activity={x} dayNr={parameter?.dayNr} />)}
        </div>

      </main>

      <FabButton icon={<IconAdjustmentsHorizontal size={35} color="#581e0d" />} hide={!!openModal} action={openFilter} />
      {!!openModal && (
      <Modal title={openModal} close={closeModal}>
        {openModal === 'Filtern' && <FilterList data={activityFilter} values={filter} change={updateFilter} close={closeModal} />}
      </Modal>
      )}
    </Fragment>
  );
};

export default ActivityList;
