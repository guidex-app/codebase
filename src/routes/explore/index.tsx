import { IconAdjustmentsHorizontal, IconUserSearch } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import BackButton from '../../components/backButton';
import FabButton from '../../components/fabButton';
import TextHeader from '../../components/infos/iconTextHeader';
import BasicMasonry from '../../components/masonry/basicMasonry';
import { getFireCollection } from '../../data/fire';
import useTitle from '../../hooks/seo/useTitle';

const Explore: FunctionalComponent = () => {
  const [topicList, setTopicList] = useState<any[] | false | undefined>(false);
  useTitle('Entdecke unsere Empfehlungen');

  const fetchTopics = async () => {
    const topics: any = await getFireCollection('topics', false, [['type', '==', 'topicpage']]);
    setTopicList(topics[0] ? topics : undefined);
  };

  useEffect(() => { fetchTopics(); }, []);

  return (
    <Fragment>
      <TextHeader
        icon={<IconUserSearch />}
        title="Entdecken"
        text="Entdecke neue Unternehmungen. Durstöbere unsere Kategorien nach neuen Unternehmungen"
      />
      <BackButton url="/" />
      <BasicMasonry list={topicList} link="explore" />
      <FabButton icon={<IconAdjustmentsHorizontal size={35} color="#581e0d" />} action={() => console.log('klick')} />
    </Fragment>
  );
};

export default Explore;
