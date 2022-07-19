import { IconArrowRight, IconInfoCircle } from '@tabler/icons';
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
      backgroundColor: 'var(--fifth)',
      padding: '100px 15px 30px 15px',
      borderRadius: '0 0 20px 20px',
      marginBottom: '15px',
    }}
    >
      Was möchtest du bearbeiten?
    </h2>

    <div style={{ paddingBottom: '15px' }}>
      {fields?.includes(questions[0].info.title.form) ? questions.map((x: Questions, index: number) => (
        fields?.includes(x.info.title.form) && <Item icon={x.info.icon} label={x.info.title.name} text={x.info.question} action={() => select(index)} />
      )) : (
        <Item icon={<IconInfoCircle color="orange" />} type="info" label="Bitte beantworten sie zuerst die nachfolgenden Fragen." action={close} />
      )}
    </div>

    {fields && fields?.length !== questions.length && questions[fields.length] && <Item type="warning" icon={<IconArrowRight />} label={`Fortfahren (${questions[fields.length].info.title.name})`} text={questions[fields.length]?.info.question} action={() => select(fields.length)} />}
  </Fragment>
);

export default Overview;
