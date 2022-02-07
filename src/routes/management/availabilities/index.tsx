import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { Calendar, Columns } from 'react-feather';

import BackButton from '../../../components/backButton';
import FormButton from '../../../components/form/basicButton';
import Counter from '../../../components/form/counter';
import PickInput from '../../../components/form/pickInput';
import SelectInput from '../../../components/form/selectInput';
import TextHeader from '../../../components/iconTextHeader';
import Item from '../../../components/item';
import Modal from '../../../container/modal';
import { fireDocument, getFireCollection } from '../../../data/fire';
import { mergeUnique } from '../../../helper/array';
import useCompany from '../../../hooks/useCompany';
import useForm from '../../../hooks/useForm';
import { Activity } from '../../../interfaces/activity';
import { ServiceInfo } from '../../../interfaces/company';
import { FormInit } from '../../../interfaces/form';
import Capacity from './capacity';

interface ActivityProp {
    activityID: string;
    activity: Activity;
    uid: string;
}

const Availabilities: FunctionalComponent<ActivityProp> = ({ activity, activityID, uid }: ActivityProp) => {
  const data = useCompany(activityID, activity);
  if (!data || !uid) {
    return (
      <TextHeader
        icon={<Columns color="#bf5bf3" />}
        title="Verfügbarkeiten"
        text="Die Verfügbarkeiten geben für jeder Ihrer definierten Leistungen, Kapazitäten für jeden Tag an. Sie Definieren somit wie viele und wann gebucht werden kann."
      />
    );
  }

  const formInit: FormInit = {
    countMinPerson: { value: 1, type: 'number', required: false },
    countMaxRoomPerson: { value: 10, type: 'number', required: false },

    leadTimeInMin: { value: 30, type: 'number', required: false },
    minAge: { value: 1, type: 'number', required: false },

    defaultCapacity: { value: 10, type: 'number', required: true },
    storno: { value: '24 Std.', type: 'string', required: false },
  };

  const [selected, setSelected] = useState<ServiceInfo | false>(false);
  const [selectList, setSelectList] = useState<ServiceInfo[] | false>(false);
  const [showCapacity, setShowCapacity] = useState(false);
  const { fields, formState, changeField, isValid } = useForm(formInit);

  const loadListData = () => {
    getFireCollection(`activities/${data.title.form}/services/`, false, [['serviceName', '!=', false]]).then((listData: ServiceInfo[]) => {
      if (listData) {
        setSelectList(listData);
        if (!listData[1] && listData[0]) setSelected(listData[0]);
      }
    });
  };

  const changeSelect = (value: string) => {
    setSelected(selectList ? selectList?.find((x: ServiceInfo) => x.serviceName === value) || false : false);
  };

  const toggleShowCapacity = () => setShowCapacity(!showCapacity);

  useEffect(() => { if (data.title.form) loadListData(); }, [data]);

  const validateForm = () => {
    if (selected && selected.id && isValid()) {
      fireDocument(`activities/${activityID}/available/${selected.id}`, fields, 'set').then(() => {
        if (!data.state?.includes('available')) fireDocument(`activities/${activityID}`, { online: false, state: mergeUnique(['available'], data.state) }, 'update');
        route(`/company/dashboard/${activityID}`);
      });
    }
  };

  return (
    <Fragment>
      <TextHeader
        icon={<Columns color="#bf5bf3" />}
        title="Verfügbarkeiten"
        text="Die Verfügbarkeiten geben für jeder Ihrer definierten Leistungen, Kapazitäten für jeden Tag an. Sie Definieren somit wie viele und wann gebucht werden kann."
      />
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />
        {selectList !== false && (
          <SelectInput
            label="Wähle eine Leistung:"
            name="select"
            value={selected ? selected?.serviceName : undefined}
            options={selectList.map((x: ServiceInfo) => x.serviceName || 'Name nicht definiert')}
            error={selected !== false ? 'valid' : 'invalid'}
            required
            change={changeSelect}
          />
        )}

        {selected !== false && (
          <Fragment>
            <form>
              <section class="group form">
                <h3>Kapazitäten {formState.countMinPerson}</h3>
                <Counter
                  label="Mindest Personenanzahl"
                  name="countMinPerson"
                  value={fields.countMinPerson}
                  required
                  change={changeField}
                />
                {selected.serviceType !== 'entry' && (
                <Counter
                  label="Maximale Personenanzahl"
                  name="countMaxRoomPerson"
                  value={fields.countMaxRoomPerson}
                  required
                  change={changeField}
                />
                )}
              </section>

              <section class="group form">
                <h3>Reservierung</h3>

                {/* <BasicInput
                  type="number"
                  label="Vorlaufzeit (Minuten)"
                  name="leadTimeInMin"
                  value={fields.leadTimeInMin}
                  placeholder="Vorlaufzeit für die Reservierungen"
                  error={formState.leadTimeInMin}
                  required
                  change={changeField}
                /> */}

                <Counter label="Vorlaufzeit (Minuten)" name="leadTimeInMin" value={fields.leadTimeInMin} change={changeField} />
                <Counter label="Welches Mindestalter ist erforderlich" name="minAge" value={fields.minAge} change={changeField} />

                {/* <BasicInput
                  type="number"
                  label="Welches Mindestalter ist erforderlich"
                  name="minAge"
                  value={fields.minAge}
                  placeholder="Vorlaufzeit für die Reservierungen"
                  error={formState.minAge}
                  required
                  change={changeField}
                /> */}

                <PickInput
                  label="Stornierungs-Möglichkeiten"
                  name="storno"
                  options={['48 Std.', '24 Std.', '12 Std.', '8 Std.', '1 Std.', 'Nicht möglich']}
                  value={[fields.storno]}
                  error={formState.storno}
                  required
                  change={changeField}
                />
              </section>

              <section class="group form">
                <h3>Anzahl der Verfügbarkeiten</h3>
                {/* <BasicInput
                  type="number"
                  label="Standartverfügbarkeiten"
                  name="defaultCapacity"
                  value={fields.defaultCapacity}
                  placeholder="Geben sie Ihre Standartverfügbarkeiten an"
                  error={formState.defaultCapacity}
                  required
                  change={changeField}
                /> */}
                <Counter label="Standartverfügbarkeiten" name="defaultCapacity" value={fields.defaultCapacity} change={changeField} />

                <Item icon={<Calendar />} label="Individuell konfigurieren (Tag / Uhrzeit)" text="Klicke um für bestimmte Uhrzeiten oder Tage eine Individuelle verfügbarkeit anzugeben" type="grey" action={toggleShowCapacity} />
              </section>
            </form>

            <FormButton label="Speichern" action={validateForm} />
          </Fragment>
        )}

      </main>
      {showCapacity && data.openings && selected && selected.id && (
        <Modal title="Kapazitäten bearbeiten" close={toggleShowCapacity} type="large">
          <Capacity
            openings={data.openings}
            activityID={activityID}
            serviceID={selected.id}
            defaultValue={fields.defaultCapacity || 10}
          />
        </Modal>
      )}
    </Fragment>
  );
};

export default Availabilities;
