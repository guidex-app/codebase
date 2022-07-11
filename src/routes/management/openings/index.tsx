/* eslint-disable no-nested-ternary */
import { IconCalendar, IconClock, IconInfoCircle } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';

import BackButton from '../../../components/backButton';
import Chip from '../../../components/chip';
import FormButton from '../../../components/form/basicButton';
import CheckInput from '../../../components/form/checkInput';
import MultiInput from '../../../components/form/Inputs/multi';
import TextHeader from '../../../components/infos/iconTextHeader';
import Item from '../../../components/item';
import { fireDocument } from '../../../data/fire';
import { dayNames } from '../../../helper/date';
import useCompany from '../../../hooks/useCompany';
import useForm from '../../../hooks/useForm';
import { Activity } from '../../../interfaces/activity';

interface ActivityProp {
    activityID: string;
    activity: Activity;
}

const Openings: FunctionalComponent<ActivityProp> = ({ activity, activityID }: ActivityProp) => {
  const data: Activity | undefined = useCompany(activityID, activity);
  const header = (
    <TextHeader
      icon={<IconClock color="#63d2ff" />}
      title="Öffnungszeiten"
      text="Bitte legen sie fest, an welchen Tagen und Uhrzeiten sie geöffnet haben."
    />
  );
  if (!data) return header;

  const { form, changeForm } = useForm({
    openings: data.openings ? data.openings : [false, false, false, false, false, false, false],

    isEqual: false,
    equalValue: undefined,
  }, []);

  const isEqual = () => changeForm(!form.isEqual, 'isEqual');

  const changeOpening = (value: any, key: string) => {
    const name: number = +key;
    const newOpenings = form.openings.map((x: string | false, index: number) => (index === name ? (value === undefined ? '-' : value || false) : x));
    changeForm([...newOpenings], 'openings');
  };

  const changeIsEqual = (value: any, key: string) => {
    const newOpenings = form.openings.map((x: string | false) => (x !== false ? value : x));
    console.log(newOpenings);
    changeForm(value, key);
    changeForm([...newOpenings], 'openings');
  };

  const validateForm = async () => {
    const openingFields = await {
      openings: form.openings,
    };

    await fireDocument(`activities/${data.title.form}`, openingFields, 'update');

    route(`/company/specific/${data.title.form}`);
  };

  return (
    <Fragment>
      {header}
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />

        <form>
          <section class="group form">
            <h3>An welchen Tagen haben sie geöffnet?</h3>

            {dayNames.map((day, index) => (
              <Chip label={day} type={form.openings?.[index] ? 'active' : 'inactive'} action={() => changeOpening(form.openings?.[index] ? false : '-', index.toString())} />
            ))}

            <Item icon={<IconInfoCircle color="var(--orange)" />} type="info" label="Markiere alle geöffneten Tage in Orange." />
          </section>

          <section class="group form">
            <h3>Welche Öffnungszeiten habt ihr?</h3>

            {!form.openings?.every((x: string | boolean) => x === false) ? (
              <Fragment>
                <CheckInput
                  label="Alle Zeiten sind identisch"
                  value={form.isEqual}
                  name="isEqual"
                  change={isEqual}
                />

                {form.isEqual ? (
                  <MultiInput
                    icon={<IconCalendar />}
                    type="time"
                    label="Standart Öffnungszeiten (Von / Bis)"
                    name="equalValue"
                    value={form.equalValue || '-'}
                    placeholder="von / bis"
                    required
                    change={changeIsEqual}
                  />
                ) : (
                  dayNames.map((day: string, index: number) => (form.openings?.[index] && (
                    <MultiInput
                      icon={<IconCalendar />}
                      type="time"
                      label={`${day} (Von / Bis)`}
                      name={index.toString()}
                      value={form.openings?.[index] || '-'}
                      placeholder="von / bis"
                      required
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
