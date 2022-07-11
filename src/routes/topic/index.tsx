import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import BackButton from '../../components/backButton';
import BasicMasonry from '../../components/masonry/basicMasonry';
import Loading from '../../components/masonry/loading';
import filterCats from '../../data/filter';
import { getFireCollection } from '../../data/fire';
import useTitle from '../../hooks/seo/useTitle';
import useCompany from '../../hooks/useCompany';
import { Location } from '../../interfaces/user';
import style from './style.module.css';

interface TopicProps {
    topicID: string;
    location: Location;
}

const TopicPage: FunctionalComponent<TopicProps> = ({ topicID, location }: TopicProps) => {
  const data: any = useCompany(topicID, undefined, true);
  const [list, setList] = useState<any[] | false | undefined>(false);
  useTitle(`Guidex | ${data?.title?.name || 'Entdeckungen'}`);

  const loadTopicList = async () => {
    if (!data?.title) return;
    console.log(location);
    // const cats: any = await getFireCollection(`geo/${location.geoHash}/categories`, false, undefined, 100);
    const cats: any = await getFireCollection('catInfos', false, undefined, 100);

    const filteredCats = await filterCats(cats, data.filter, undefined); // weather hinzufügen

    return setList(filteredCats);
  };

  useEffect(() => { loadTopicList(); }, [data]);

  return (
    <main class={style.topic}>
      <BackButton url="/explore" />
      <header class="small_size_holder" style={data ? { backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/topics%2F${data.title.form}%2F${data.title.form}_600x450.jpeg?alt=media)` } : undefined}>
        <div><h1>{data?.title.name}&nbsp;</h1></div>
      </header>
      <article class="small_size_holder">
        <p><strong>{data?.description}</strong></p>
        {data ? data.partitions?.map((p: string) => (
          <p style={{ color: 'var(--fifth)' }}>{p}</p>
        )) : (
          <Fragment>
            <p style={{ backgroundColor: 'var(--fourth)', marginBottom: '5px', marginTop: '0' }}>&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p style={{ backgroundColor: 'var(--fourth)', marginTop: '0', opacity: 0.7 }}>&nbsp;&nbsp;&nbsp;</p>
            <p style={{ backgroundColor: 'var(--fourth)', opacity: 0.5 }}>&nbsp;&nbsp;&nbsp;</p>
          </Fragment>
        )}
      </article>
      {list === false && data?.title ? <Loading /> : <BasicMasonry list={list} />}
    </main>
  );
};

export default TopicPage;
