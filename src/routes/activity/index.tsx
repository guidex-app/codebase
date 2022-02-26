import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Feather, Info } from 'react-feather';

import BackButton from '../../components/backButton';
import FabButton from '../../components/fabButton';
import TextHeader from '../../components/iconTextHeader';
import Item from '../../components/item';
import { getFireCollection, getFireDocument } from '../../data/fire';
import { Activity } from '../../interfaces/activity';
import { Cat } from '../../interfaces/categorie';
import ActivityItem from './activityItem';
import style from './style.module.css';

interface ActivitiesProps {
    categoryID: string;
}

const ActivityList: FunctionalComponent<ActivitiesProps> = ({ categoryID }: ActivitiesProps) => {
  const [category, setCategory] = useState<Cat | undefined>();
  const [list, setList] = useState<Activity[] | undefined | false>(false);
  const [openModal] = useState<'filter' | 'addToList' | false>(false);
  // const closeModal = () => setOpenModal(false);

  const getActivityList = () => {
    if (categoryID) {
      getFireCollection('activities', false, [['category.form', '==', categoryID]]).then((listData: Activity[]) => {
        setList(listData?.[0] ? listData : undefined);
      });
    }
  };

  const getCategorie = () => {
    if (categoryID) {
      getFireDocument(`catInfos/${categoryID}`).then((data: Cat) => {
        if (data.title.form) {
          setCategory(data);
          getActivityList();
        }
      });
    }
  };

  useEffect(() => { getCategorie(); }, [categoryID]);

  return (
    <Fragment>
      <BackButton url="/" title="Zurück" />

      <TextHeader
        image={`https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/categories%2F${categoryID}%2F${categoryID}_250x200`}
        title={category?.title.name || ''}
        text="Bitte geben Sie hier den Namen Ihrer Unternehmung an z.B. „Lasertag Licht und mehr“.
        Der Name Ihrer Unternehmung ist ihr öffentliches Label"
      />
      {/* <Item type="large" title={category?.title.name || ''}
        text="Bitte geben Sie hier den Namen Ihrer Unternehmung an z.B. „Lasertag Licht und mehr“.
        Der Name Ihrer Unternehmung ist ihr öffentliches Label" /> */}

      <main style={{ padding: '20px 10px' }} class="size_holder">

        {list === undefined && <Item icon={<Info />} type="info" label="Es wurde nichts in deiner Nähe gefunden" text="Überprüfe deinen Standort oder wähle eine andere Aktivität" />}
        <div class={style.list}>
          {list && (
            <Fragment>
              {list && list?.map((x: Activity) => <ActivityItem activity={x} />)}
              <ActivityItem activity={list[1]} />
              <ActivityItem activity={list[1]} />
              <ActivityItem activity={list[1]} />
              <ActivityItem activity={list[1]} />
              <ActivityItem activity={list[1]} />
            </Fragment>
          )}

        </div>

      </main>

      <FabButton icon={<Feather size={35} color="#581e0d" />} hide={!!openModal} action={() => console.log('test')} />
    </Fragment>
  );
};

export default ActivityList;
