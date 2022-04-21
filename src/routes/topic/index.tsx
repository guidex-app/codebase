import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import BackButton from '../../components/backButton';
import Masonry from '../../components/masonry';
import filterCats from '../../data/filter';
import { getFireCollection } from '../../data/fire';
import useCompany from '../../hooks/useCompany';
import { Location } from '../../interfaces/user';
import style from './style.module.css';

interface TopicProps {
    topicID: string;
    location: Location;
}

const TopicPage: FunctionalComponent<TopicProps> = ({ topicID, location }: TopicProps) => {
  const data: any = useCompany(topicID, undefined, 'topics');
  const [list, setList] = useState<any[] | undefined>(undefined);

  const loadTopicList = async () => {
    if (!data?.title) return;
    const cats: any = await getFireCollection(`geo/${location.geoHash}/categories`, false, undefined, 100);

    const filteredCats = await filterCats(cats, data.filter, location.weather);

    return setList(filteredCats);
  };

  useEffect(() => { loadTopicList(); }, [data]);

  return (
    <main class={style.topic}>
      <BackButton url="/explore" />
      <header class="small_size_holder" style={data ? { backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/topics%2F${data.title.form}%2F${data.title.form}_600x450.jpeg?alt=media)` } : undefined}>
        <div>
          <h1>{data?.title.name}&nbsp;</h1>
        </div>
      </header>
      <article class="small_size_holder">
        <p><strong>{data?.description}</strong></p>
        {data?.partitions?.map((p: string) => (
          <p style={{ color: 'var(--fifth)' }}>{p}</p>
        ))}
      </article>
      {list && <Masonry list={list} />}
    </main>
  );
};

export default TopicPage;
