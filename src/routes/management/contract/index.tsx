import { IconHome, IconInfoCircle } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';

import BackButton from '../../../components/backButton';
import FormButton from '../../../components/form/basicButton';
import CheckInput from '../../../components/form/checkInput';
import TextHeader from '../../../components/infos/iconTextHeader';
import Item from '../../../components/item';
import { fireDocument } from '../../../data/fire';
import useCompany from '../../../hooks/useCompany';
import { Activity } from '../../../interfaces/activity';

interface ActivityProp {
    activityID: string;
    activity: Activity;
}

const Contract: FunctionalComponent<ActivityProp> = ({ activity, activityID }: ActivityProp) => {
  const data: Activity | undefined = useCompany(activityID, activity);
  const header = (
    <TextHeader
      icon={<IconHome color="#ff5613" />}
      title="Vertrag & Rechtliches"
      text="Hier definieren sie alles, was für die Kontaktaufnahme wichtig ist."
    />
  );
  if (!data) return header;

  const [termsAccepted, setTermsAccepted] = useState(data.termsAccepted || false);

  const toggleTerms = () => {
    setTermsAccepted(!termsAccepted);
  };

  const save = async () => {
    await fireDocument(`activities/${data.title.form}`, { termsAccepted }, 'update');
    route(`/company/dashboard/${activityID}`);
  };

  return (
    <Fragment>
      {header}
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />

        {activity?.address ? (
          <form>
            <section class="group form">
              <h3>Maklervertrag</h3>

              <p>sfsdfsdfsdfsdfsdfsdf</p>

              <CheckInput
                label="Wir stimmen den Vertragsbedingungen zu"
                name="accept"
                value={termsAccepted}
                change={toggleTerms}
              />

            </section>

            <FormButton action={save} label="Speichern" />

          </form>
        ) : <Item icon={<IconInfoCircle />} type="info" label="Bitte geben sie zuerst ihre Adresse an" />}
      </main>
    </Fragment>
  );
};

export default Contract;
