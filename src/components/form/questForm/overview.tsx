import { Fragment, FunctionalComponent, h } from 'preact';
import { Info } from 'react-feather';
import { Questions } from '../../../interfaces/company';
import Item from '../../item';
import TopButton from '../../topButton';

interface OverviewProps {
    questions: Questions[];
    fields?: string[];
    close: () => void;
    select: (index: number) => void;
}

const Overview: FunctionalComponent<OverviewProps> = ({ fields, questions, select, close }: OverviewProps) => (
  <Fragment>
    <h2 style={{ padding: '10px' }}>Wähle eine Frage, die du bearbeiten möchtest.</h2>

    <section class="form group" style={{ margin: '10px' }}>
      <TopButton action={close} title="Zurück" />
      {fields?.includes(questions[0].info.title.form) ? questions.map((x: Questions, index: number) => (
        fields?.includes(x.info.title.form) && <Item icon={x.info.icon} label={x.info.title.name} type="large" text={x.info.question} action={() => select(index)} />
      )) : (
        <Item icon={<Info />} label="Bitte beantworten Sie zuerst die Fragen." action={close} />
      )}
      <p class="grey">Wenn Ihre Frage hier noch nicht angezeigt wird, haben sie noch nicht alle vorherigen Fragen ausgefüllt.</p>
    </section>
  </Fragment>
);

export default Overview;
