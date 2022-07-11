import { IconSelect, IconStar } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';

import BackButton from '../../../components/backButton';
import FormButton from '../../../components/form/basicButton';
import TextInput from '../../../components/form/Inputs/textArea';
import PickInput from '../../../components/form/pickInput';
import TextHeader from '../../../components/infos/iconTextHeader';
import { fireDocument } from '../../../data/fire';
import useCompany from '../../../hooks/useCompany';
import useForm from '../../../hooks/useForm';
import { Activity } from '../../../interfaces/activity';

interface ActivityProp {
    activityID: string;
    activity: Activity;
}

const Specific: FunctionalComponent<ActivityProp> = ({ activity, activityID }: ActivityProp) => {
  const data: Activity | undefined = useCompany(activityID, activity);
  const header = (
    <TextHeader
      icon={<IconStar color="#2fd159" />}
      title="Spezifische Infos"
      text="Bitte gebe alle gesonderten Informationen zu deiner Unternehmung an."
    />
  );
  if (!data) return header;

  const { form, changeForm, isValid } = useForm({
    filter: data.filter,
    language: data.language,
  });

  const validateForm = async () => {
    if (isValid) {
      const formFields = {
        ...(form.filter && { filter: form.filter }),
      };
      await fireDocument(`activities/${data.title.form}`, formFields, 'update');

      route(`/company/images/${data.title.form}`);
    }
  };

  return (
    <Fragment>
      {header}
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />

        <form>
          <section class="group form">
            <h3>Events</h3>

            <PickInput
              label="Welche Events können bei euch veranstaltet werden?"
              name="filter"
              options={['Weihnachtsfeiern', 'Geburtstagsfeiern', 'Schulausflüge', 'Firmenevents']}
              value={form.filter}
              multi
              required
              change={changeForm}
            />

          </section>

          <section class="group form">
            <h3>Austattung</h3>

            <PickInput
              label="Wähle alle vorhandenen Ausstattungen aus."
              name="filter"
              options={['Parkmöglichkeiten', 'Barrierefrei', 'Gastronomie', 'Hunde sind erlaubt', 'Öffentliche Toiletten']}
              value={form.filter}
              multi
              change={changeForm}
            />

          </section>

          <section class="group form">
            <h3>Sicherheitsmaßnahmen</h3>
            <PickInput
              label="Welche Sicherheitsmaßnahmen gelten bei euch?"
              name="filter"
              options={['Corona Maßnahmen', 'Maskenpflicht', '3G', '3G+', '2G', '2G+']}
              value={form.filter}
              multi
              change={changeForm}
            />

            <TextInput
              icon={<IconSelect />}
              label="Zusätzliche Informationen zu den Sicherheitsmaßnahmen"
              name="description"
              value={form.description}
              placeholder="z.B.: Die maximale Gruppengröße beträgt 4 Personen und die Mindestabstände sind einzuhalten."
              change={changeForm}
            />

          </section>

          <section class="group form">
            <h3>Sprachen</h3>

            <PickInput
              label="Welche Sprachen sprechen Sie oder Ihre Mitarbeiter?"
              name="language"
              options={['Deutsch', 'Englisch', 'Französisch', 'Russisch', 'Spanisch']}
              multi
              value={form.language}
              change={changeForm}
            />

          </section>

          <FormButton action={validateForm} disabled={!isValid} label="Speichern und weiter" />

        </form>

      </main>
    </Fragment>
  );
};

export default Specific;
