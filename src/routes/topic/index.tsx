import { Fragment, FunctionalComponent, h } from 'preact';
import { Star } from 'react-feather';
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
        icon={<Star color="#2fd159" />}
        title=" "
        text="Gebe alle verüfgbaren der Unternehmung an, um diese für die Nutzer anzuzeigen"
      />
    );
  }

  return (
    <Fragment>
      <TextHeader
        icon={<Star color="#2fd159" />}
        title={data.title.name}
        text={data.description}
      />
      <main class={`${style.topics} small_size_holder`}>
        <BackButton url="/explore" />
        {data.partitions?.map((p) => (
          <p>{p}</p>
        ))}
      </main>
    </Fragment>
  );
};

export default TopicPage;
