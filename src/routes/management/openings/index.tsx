import { IconCalendar, IconClock, IconInfoCircle } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';

import BackButton from '../../../components/backButton';
import Chip from '../../../components/chip';
import FormButton from '../../../components/form/basicButton';
import BasicInput from '../../../components/form/basicInput';
import CheckInput from '../../../components/form/checkInput';
import TextHeader from '../../../components/iconTextHeader';
import Item from '../../../components/item';
import { fireDocument } from '../../../data/fire';
import { dayNames } from '../../../helper/date';
import useCompany from '../../../hooks/useCompany';
import useForm from '../../../hooks/useForm';
import { Activity } from '../../../interfaces/activity';
import { FormInit } from '../../../interfaces/form';

interface ActivityProp {
    activityID: string;
    activity: Activity;
}

const Openings: FunctionalComponent<ActivityProp> = ({ activity, activityID }: ActivityProp) => {
  const data: Activity | undefined = useCompany(activityID, activity);
  if (!data) {
    return (
      <TextHeader
        icon={<IconClock color="#63d2ff" />}
        title="Öffnungszeiten"
        text="Bitte legen sie fest, an welchen Tagen und Uhrzeiten sie geöffnet haben."
      />
    );
  }

  const formInit: FormInit = {
    hasSaisonal: { value: !!data.holidayOpenings, type: 'boolean', required: false },
    hasHolidays: { value: !!data.saisonalOpenings, type: 'boolean', required: false },

    holidayOpenings: { value: data.holidayOpenings, type: 'string[]', required: false },
    saisonalOpenings: { value: data.saisonalOpenings, type: 'string[]', required: false },
    openings: { value: data.openings ? data.openings : [false, false, false, false, false, false, false], type: 'range[]', required: true },

    isEqual: { value: false, type: 'range', required: false },
    equalValue: { type: 'range', required: false },
  };

  const { fields, formState, changeField, isValid } = useForm(formInit);

  const isEqual = () => changeField(!fields.isEqual, 'isEqual');

  const changeOpening = (value: any, key: string) => {
    const name: number = +key;
    const newOpenings = fields.openings.map((x: string | false, index: number) => (index === name ? (value || false) : x));
    changeField([...newOpenings], 'openings');
  };

  const changeIsEqual = (value: any, key: string) => {
    const newOpenings = fields.openings.map((x: string | false) => (x !== false ? value : x));
    console.log(newOpenings);
    changeField(value, key);
    changeField([...newOpenings], 'openings');
  };

  const validateForm = async () => {
    if (isValid()) {
      const openingFields = await {
        // hasSaisonal: { value: !!data.holidayOpenings, type: 'boolean', required: false },
        // hasHolidays: { value: !!data.saisonalOpenings, type: 'boolean', required: false },

        // holidayOpenings: { value: data.holidayOpenings, type: 'string[]', required: false },
        // saisonalOpenings: { value: data.saisonalOpenings, type: 'string[]', required: false },
        openings: fields.openings,
      };

      await fireDocument(`activities/${data.title.form}`, openingFields, 'update');

      route(`/company/specific/${data.title.form}`);
    }
  };

  return (
    <Fragment>
      <TextHeader
        icon={<IconClock color="#63d2ff" />}
        title="Öffnungszeiten"
        text="Bitte legen sie fest, an welchen Tagen und Uhrzeiten sie geöffnet haben."
      />
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />

        <form>
          <section class="group form">
            <h3>An welchen Tagen haben sie geöffnet?</h3>

            {dayNames.map((day, index) => (
              <Chip label={day} type={fields.openings?.[index] ? 'active' : 'inactive'} action={() => changeOpening(fields.openings?.[index] ? false : '-', index.toString())} />
            ))}

            <Item icon={<IconInfoCircle />} type="info" label="Markiere alle geöffneten Tage in Orange." />
          </section>

          <section class="group form">
            <h3>Welche Öffnungszeiten habt ihr?</h3>

            {!fields.openings?.every((x: string | boolean) => x === false) ? (
              <Fragment>
                <CheckInput
                  label="Alle Zeiten sind identisch"
                  value={fields.isEqual}
                  name="isEqual"
                  change={isEqual}
                />

                {fields.isEqual ? (
                  <BasicInput
                    icon={<IconCalendar />}
                    type="time"
                    label="Standart Öffnungszeiten (Von / Bis)"
                    name="equalValue"
                    value={fields.equalValue || '-'}
                    placeholder="von / bis"
                    error={formState.equalValue}
                    required
                    isMulti
                    change={changeIsEqual}
                  />
                ) : (
                  dayNames.map((day: string, index: number) => (fields.openings?.[index] && (
                    <BasicInput
                      icon={<IconCalendar />}
                      type="time"
                      label={`${day} (Von / Bis)`}
                      name={index.toString()}
                      value={fields.openings?.[index] || '-'}
                      placeholder="von / bis"
                      error={formState.openings}
                      required
                      isMulti
                      change={changeOpening}
                    />
                  ))))}
              </Fragment>

            ) : (
              <Item icon={<IconInfoCircle />} type="info" label="Konfiguriere zuerst alle geöffneten Tage." />
            )}

          </section>

          <FormButton action={validateForm} label="Speichern" />

        </form>

      </main>
    </Fragment>
  );
};

export default Openings;
