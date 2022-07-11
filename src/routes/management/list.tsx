import { IconPlus } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import BackButton from '../../components/backButton';
import TextHeader from '../../components/infos/iconTextHeader';
import Item from '../../components/item';
import Spinner from '../../components/spinner';
import { getFireCollection } from '../../data/fire';
import { Activity } from '../../interfaces/activity';

interface ListProps {
    setActivity: (activity: Activity | undefined) => void;
    uid: string;
}

const List: FunctionalComponent<ListProps> = ({ setActivity, uid }: ListProps) => {
  const [list, setList] = useState<any[] | undefined | false>(false);

  const fetchActivities = async () => {
    console.log('neue activites');
    const data: any = await getFireCollection('activities', false, [['member', 'array-contains', uid]]);
    setList(data || undefined);
  };

  useEffect(() => {
    if (list === false) fetchActivities();
  }, []);

  return (
    <Fragment>
      <BackButton title="Startseite" url="/" />
      <TextHeader
        title="Ihre Erlebnisse"
        text="Legen sie ein neues Erlebnis an oder verwalten sie bereits bestehende."
      />
      <main class="small_size_holder">
        <Item label="Ein neues Erlebnis erstellen" type="grey" icon={<IconPlus />} link="/company/basic/new" action={() => setActivity(undefined)} />

        {list === false && <Spinner />}

        {list ? list.map((x) => (
          <Item label={x.title.name} text={x.address?.street || undefined} action={() => setActivity(x)} link={`/company/dashboard/${x.title.form}`} image={x.state?.includes('thumbnail') ? `https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/activities%2F${x.title.form}%2F${x.title.form}_250x200` : undefined} editLabel={x.state?.includes('online') ? 'Online' : 'In Bearbeitung'} />
        )) : (
          list !== false && <p style={{ textAlign: 'center', color: 'var(--fifth)' }}>Es wurden noch keine Unternehmungen angelegt.</p>
        )}
      </main>
    </Fragment>
  );
};

export default List;
