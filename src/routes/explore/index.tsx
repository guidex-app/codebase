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
      {/* calc((100vw - 75px) / 4) */}
      {/* <img
        style={{
          margin: '15px',
          width: 'auto',
          height: 'calc((((100vw - 75px) / 4) / 7) * 9)',
        }}
        alt=""
        src="https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/topics%2Ferlebnisessen%2Ferlebnisessen_600x450.jpeg?alt=media"
      /> */}
      <BasicMasonry list={topicList} link="explore" />
      <FabButton icon={<IconAdjustmentsHorizontal size={35} color="#581e0d" />} action={() => console.log('klick')} />
    </Fragment>
  );
};

export default Explore;
