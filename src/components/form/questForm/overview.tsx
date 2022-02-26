import { Fragment, FunctionalComponent, h } from 'preact';
import { Info } from 'react-feather';

import { Questions } from '../../../interfaces/company';
import Item from '../../item';
import TopButton from '../../topButton';

interface OverviewProps {
    questions: Questions[];
    fields?: string[];
    showBackButton?: boolean;
    close: () => void;
    select: (index: number) => void;
}

const Overview: FunctionalComponent<OverviewProps> = ({ fields, questions, showBackButton, select, close }: OverviewProps) => (
  <Fragment>
    <h2 style={{ paddingBottom: '10px' }}>Was möchtest du bearbeiten?</h2>

    <section class="form group">
      {showBackButton && <TopButton action={close} title="Zurück" />}
      {fields?.includes(questions[0].info.title.form) ? questions.map((x: Questions, index: number) => (
        fields?.includes(x.info.title.form) && <Item icon={x.info.icon} label={x.info.title.name} text={x.info.question} action={() => select(index)} />
      )) : (
        <Item icon={<Info />} label="Bitte beantworten Sie zuerst die Fragen." action={close} />
      )}

      {fields && fields?.length !== questions.length && questions[fields.length] && <Item icon={questions[fields.length].info.icon} label={`${questions[fields.length].info.title.name} (Nächste Frage)`} type="large" text={questions[fields.length]?.info.question} action={() => select(fields.length)} />}
    </section>
  </Fragment>
);

export default Overview;
