import { Fragment, FunctionalComponent, h } from 'preact';

import BackButton from '../../components/backButton';
import useCompany from '../../hooks/useCompany';
import { Topic } from '../../interfaces/topic';
import style from './style.module.css';

interface TopicProps {
    topicID: string;
}

const TopicPage: FunctionalComponent<TopicProps> = ({ topicID }: TopicProps) => {
  const data: Topic = useCompany(topicID, undefined, 'topics');


  return (
    <main class={`${style.topics} small_size_holder`}>
      <BackButton url="/explore" />
      <article>
        <h1>{data?.title.name || ''}</h1>
        <p><strong>{data?.description}</strong></p>
        {data?.partitions?.map((p) => (
          <p class="grey">{p}</p>
        ))}
      </article>
    </main>
  );
};

export default TopicPage;
