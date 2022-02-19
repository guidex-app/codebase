import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import BackButton from '../../components/backButton';
import Masonry from '../../components/masonry';
import filterCats from '../../data/filter';
import { getFireCollection } from '../../data/fire';
import useCompany from '../../hooks/useCompany';
import { Topic } from '../../interfaces/topic';
import { User } from '../../interfaces/user';
import style from './style.module.css';

interface TopicProps {
    topicID: string;
    user: User;
}

const TopicPage: FunctionalComponent<TopicProps> = ({ topicID, user }: TopicProps) => {
  const data: Topic = useCompany(topicID, undefined, 'topics');
  const [list, setList] = useState<any[] | undefined>(undefined);

  const loadTopicList = async () => {
    if (!data?.title) return;
    const cats: any = await getFireCollection(`geo/${user.location?.geoHash}/categories`, false, undefined, 100);

    console.time('filterTime');
    const filteredCats = await filterCats(cats, data.filter, user.weather);
    console.timeEnd('filterTime');

    return setList(filteredCats);
  };

  useEffect(() => { loadTopicList(); }, [data]);

  return (
    <main class={style.topic}>
      <BackButton url="/explore" />
      <header class="small_size_holder" style={data ? { backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/topics%2F${data.title.form}%2F${data.title.form}_600x450.jpeg?alt=media)` } : undefined}>
        <div>
          <h1>{data?.title.name || ''}</h1>
          <p>{data?.filter?.join(', ') || '...'}</p>
        </div>
      </header>
      <article class="small_size_holder">
        <p><strong>{data?.description}</strong></p>
        {data?.partitions?.map((p) => (
          <p class="grey">{p}</p>
        ))}
      </article>
      {list && <Masonry items={list} />}
    </main>
  );
};

export default TopicPage;
