import { IconCompass, IconFeather } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import BackButton from '../../components/backButton';
import FabButton from '../../components/fabButton';
import TextHeader from '../../components/iconTextHeader';
import Masonry from '../../components/masonry';
import { getFireCollection } from '../../data/fire';

const Explore: FunctionalComponent = () => {
  const [topicList, setTopicList] = useState<any[]>([]);

  const fetchTopics = async () => {
    const topics: any = await getFireCollection('topics', false, [['type', '==', 'topicpage']]);
    if (topics) setTopicList(topics);
  };

  useEffect(() => { fetchTopics(); }, []);

  return (
    <Fragment>
      <TextHeader
        icon={<IconCompass color="#fea00a" />}
        title="Entdecken"
        text="Entdecke neue Unternehmungen. Durstöbere unsere Kategorien nach neuen Unternehmungen"
      />
      <BackButton url="/" />
      <Masonry list={topicList} type="Topic" />
      <FabButton icon={<IconFeather size={35} color="#581e0d" />} action={() => console.log('klick')} />
    </Fragment>
  );
};

export default Explore;
