import { Fragment, FunctionalComponent, h } from 'preact';

import BackButton from '../../components/backButton';
import TextHeader from '../../components/iconTextHeader';
import useCompany from '../../hooks/useCompany';
import { Topic } from '../../interfaces/topic';
import style from './style.module.css';

interface TopicProps {
    topicID: string;
}

const TopicPage: FunctionalComponent<TopicProps> = ({ topicID }: TopicProps) => {
  const data: Topic = useCompany(topicID, undefined, 'topics');
  if (!data) {
    return (
      <TextHeader
        title=" "
        text=""
      />
    );
  }

  return (
    <Fragment>
      <TextHeader
        title={data.title.name}
        text=""
      />
      <main class={`${style.topics} small_size_holder`}>
        <BackButton url="/explore" />
        <article>
          <p><strong>{data.description}</strong></p>
          {data.partitions?.map((p) => (
            <p>{p}</p>
          ))}
        </article>
      </main>
    </Fragment>
  );
};

export default TopicPage;
