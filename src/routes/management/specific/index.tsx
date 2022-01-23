import { Fragment, FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { Star, Type } from 'react-feather';
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
        text="Gebe alle verüfgbaren der Unternehmung an, um diese für die Nutzer anzuzeigen"
      />
    );
  }

  const formInit: FormInit = {
    filter: { value: data.filter, type: 'string[]', required: false },
    language: { value: data.language, type: 'string[]', required: false },
  };

  const { fields, formState, changeField, isValid } = useForm(formInit);

  const navigate = (finished?: true) => (formState.image !== 'valid' || finished) && route('/company');

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
        text="Gebe alle verüfgbaren der Unternehmung an, um diese für die Nutzer anzuzeigen"
      />
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />

        <form>
          <section class="group form">
            <h3>Events</h3>

            <PickInput
              label="Wähle Verfügbare Events"
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
              label="Wähle Die verfügbare Austattung"
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
              label="Wähle die verfügbaren Sicherheitsmaßnahmen"
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
              label="Zusätzliche Sicherheitsmaßnahmen"
              name="description"
              type="textarea"
              value={fields.description}
              placeholder="Bitte gebe Hygienemaßnahmen oder andere zusätzlichen Informationen an."
              error={formState.description}
              change={changeField}
            />

          </section>

          <section class="group form">
            <h3>Sprachen</h3>

            <SelectInput
              icon={<Type />}
              label="Wähle die verfügbaren sprachen"
              name="description"
              options={['Deutsch', 'Englisch', '...']}
              value={fields.language}
              error={formState.language}
              change={changeField}
            />

          </section>

          <FormButton action={validateForm} label="Speichern" />

        </form>

      </main>
    </Fragment>
  );
};

export default Specific;
