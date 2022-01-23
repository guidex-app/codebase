import { Fragment, FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';
import { Calendar, Columns } from 'react-feather';
import BackButton from '../../../components/backButton';
import FormButton from '../../../components/form/basicButton';
import BasicInput from '../../../components/form/basicInput';
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

interface SelectListItem {
  title: string, id?: string, serviceType?: 'entry' | 'object' | 'roundGames';
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

  const [selected, setSelected] = useState<SelectListItem | false>(false);
  const [selectList, setSelectList] = useState<SelectListItem[] | false>(false);
  const [showCapacity, setShowCapacity] = useState(false);
  const { fields, formState, changeField, isValid } = useForm(formInit);

  const loadListData = () => {
    getFireCollection(`activities/${data.title.form}/services/`, false, [['serviceNames', '!=', false]]).then((listData: ServiceInfo[]) => {
      if (listData) {
        const newList: SelectListItem[] = [];

        listData.forEach((l: ServiceInfo) => {
          if (l.serviceNames && l.serviceType && l.id) {
            const newItems: SelectListItem[] = l.serviceNames.map((name: string) => (
              { title: name, id: l.id, serviceType: l.serviceType }
            ));
            newList.push(...newItems);
            console.log(newItems);
          }
        });
        setSelectList(newList);
      }
    });
  };

  const changeSelect = (value: string) => {
    setSelected(selectList ? selectList?.find((x: SelectListItem) => x.title === value) || false : false);
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
            value={selected ? selected?.title : undefined}
            options={selectList.map((x: any) => x.title)}
            error={selected !== false ? 'valid' : 'invalid'}
            required
            change={changeSelect}
          />
        )}

        {selected !== false && (
          <Fragment>
            <form>
              <section class="group form">
                <h3>Kapazitäten</h3>
                <BasicInput
                  type="number"
                  label="Min. anzahl Pers."
                  name="countMinPerson"
                  value={fields.countMinPerson}
                  placeholder="Die Persohnenanzahl"
                  error={formState.countMinPerson}
                  required
                  change={changeField}
                />
                {selected.serviceType !== 'entry' && (
                <BasicInput
                  type="number"
                  label="Max. anzahl Pers."
                  name="countMaxRoomPerson"
                  value={fields.countMaxRoomPerson}
                  placeholder="Die Persohnenanzahl"
                  error={formState.countMaxRoomPerson}
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
      {showCapacity && data.openings && selected && (
        <Modal title="Kapazitäten bearbeiten" close={toggleShowCapacity} type="large">
          <Capacity
            openings={data.openings}
            collection={`activities/${activityID}/services/${selected.title}/available/${selected.id}/rows`}
            defaultValue={fields.defaultCapacity || 10}
          />
        </Modal>
      )}
    </Fragment>
  );
};

export default Availabilities;
