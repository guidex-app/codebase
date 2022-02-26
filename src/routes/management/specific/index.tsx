import { Fragment, FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { Globe, Star, Type } from 'react-feather';

import BackButton from '../../../components/backButton';
import FormButton from '../../../components/form/basicButton';
import BasicInput from '../../../components/form/basicInput';
import PickInput from '../../../components/form/pickInput';
import SelectInput from '../../../components/form/selectInput';
import TextHeader from '../../../components/iconTextHeader';
import { fireDocument } from '../../../data/fire';
import useCompany from '../../../hooks/useCompany';
import useForm from '../../../hooks/useForm';
import { Activity } from '../../../interfaces/activity';
import { FormInit } from '../../../interfaces/form';

interface ActivityProp {
    activityID: string;
    activity: Activity;
    uid: string;
}

const Specific: FunctionalComponent<ActivityProp> = ({ activity, activityID, uid }: ActivityProp) => {
  const data = useCompany(activityID, activity);
  if (!data || !uid) {
    return (
      <TextHeader
        icon={<Star color="#2fd159" />}
        title="Spezifische Infos"
        text="Bitte gebe alle gesonderten Informationen zu deiner Unternehmung an."
      />
    );
  }

  const formInit: FormInit = {
    filter: { value: data.filter, type: 'string[]', required: false },
    language: { value: data.language, type: 'string[]', required: false },
  };

  const { fields, formState, changeField, isValid } = useForm(formInit);

  const navigate = (finished?: true) => (formState.image !== 'valid' || finished) && route(`/company/images/${data.title.form}`);

  const validateForm = async () => {
    if (isValid()) {
      const formFields = {
        ...(fields.filter && { filter: fields.filter }),
      };
      await fireDocument(`activities/${data.title.form}`, formFields, 'update');

      navigate();
    }
  };

  return (
    <Fragment>
      <TextHeader
        icon={<Star color="#2fd159" />}
        title="Spezifische Infos"
        text="Bitte gebe alle gesonderten Informationen zu deiner Unternehmung an."
      />
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />

        <form>
          <section class="group form">
            <h3>Events</h3>

            <PickInput
              label="Welche Events können bei euch veranstaltet werden?"
              name="filter"
              options={['Weihnachtsfeiern', 'Geburtstagsfeiern', 'Schulausflüge', 'Firmenevents']}
              value={fields.filter}
              error="valid"
            // errorMessage="Bitte wähle Deine Interessen"
              required
              change={changeField}
            />

          </section>

          <section class="group form">
            <h3>Austattung</h3>

            <PickInput
              label="Wähle alle vorhandenen Ausstattungen aus."
              name="filter"
              options={['Parkmöglichkeiten', 'Barrierefrei', 'Gastronomie', 'Hunde sind erlaubt', 'Öffentliche Toiletten']}
              value={fields.filter}
              error="valid"
            // errorMessage="Bitte wähle Deine Interessen"
              required
              change={changeField}
            />

          </section>

          <section class="group form">
            <h3>Sicherheitsmaßnahmen</h3>
            <PickInput
              label="Welche Sicherheitsmaßnahmen gelten bei euch?"
              name="filter"
              options={['Corona Maßnahmen', 'Maskenpflicht', '3G', '3G+', '2G', '2G+']}
              value={fields.filter}
              error="valid"
            // errorMessage="Bitte wähle Deine Interessen"
              required
              change={changeField}
            />

            <BasicInput
              icon={<Type />}
              label="Zusätzliche Informationen zu den Sicherheitsmaßnahmen"
              name="description"
              type="textarea"
              value={fields.description}
              placeholder="z.B.: Die maximale Gruppengröße beträgt 4 Personen und die Mindestabstände sind einzuhalten."
              error={formState.description}
              change={changeField}
            />

          </section>

          <section class="group form">
            <h3>Sprachen</h3>

            <SelectInput
              icon={<Globe />}
              label="Welche Sprachen sprechen Sie oder Ihre Mitarbeiter?"
              name="language"
              options={['Deutsch', 'Englisch', 'Französisch', 'Russisch', 'Spanisch']}
              value={fields.language}
              error={formState.language}
              change={changeField}
            />

            <p style={{ color: 'var(--orange)' }}>MEHRERE ANHAKEN ERMÖGLICHEN</p>

          </section>

          <FormButton action={validateForm} label="Speichern und weiter" />

        </form>

      </main>
    </Fragment>
  );
};

export default Specific;
