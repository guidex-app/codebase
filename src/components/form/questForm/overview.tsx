import { IconInfoCircle } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';

import { Questions } from '../../../interfaces/company';
import Item from '../../item';

interface OverviewProps {
    questions: Questions[];
    fields?: string[];
    close: () => void;
    select: (index: number) => void;
}

const Overview: FunctionalComponent<OverviewProps> = ({ fields, questions, select, close }: OverviewProps) => (
  <Fragment>
    <h2 style={{
      backgroundColor: '#46244C',
      margin: '-15px -15px 15px -15px',
      padding: '30px 15px',
      borderRadius: '0 0 20px 20px',
    }}
    >Was möchtest du bearbeiten?
    </h2>

    <section class="form group">
      {fields?.includes(questions[0].info.title.form) ? questions.map((x: Questions, index: number) => (
        fields?.includes(x.info.title.form) && <Item icon={x.info.icon} label={x.info.title.name} text={x.info.question} action={() => select(index)} />
      )) : (
        <Item icon={<IconInfoCircle color="orange" />} type="info" label="Bitte beantworten sie zuerst die nachfolgenden Fragen." action={close} />
      )}

      {fields && fields?.length !== questions.length && questions[fields.length] && <Item icon={questions[fields.length].info.icon} label={`${questions[fields.length].info.title.name} (Nächste Frage)`} type="large" text={questions[fields.length]?.info.question} action={() => select(fields.length)} />}
    </section>
  </Fragment>
);

export default Overview;
