import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';

import FormButton from '../../components/form/basicButton';
import BasicInput from '../../components/form/basicInput';
import PickInput from '../../components/form/pickInput';
import { updateUserProfil } from '../../data/auth';
import { fireDocument } from '../../data/fire';
import { setStorageKeys } from '../../data/localStorage';
import useForm from '../../hooks/useForm';
import { FormInit } from '../../interfaces/form';
import { User } from '../../interfaces/user';
import style from './style.module.css';

interface ProfileProps {
    updateUser: (data: User) => void;
}

const Profile: FunctionalComponent<ProfileProps> = ({ updateUser }: ProfileProps) => {
  const form: FormInit = {
    firstName: { type: 'string', required: true },
    lastName: { type: 'string', required: true },
    title: { value: 'Herr', type: 'string', required: true },
    plz: { type: 'plz', required: true },
    interests: { value: [], type: 'string[]', required: true },
    phone: { type: 'phone', required: true },
    birthday: { type: 'string', required: true },
  };
  const { fields, formState, changeField, isValid } = useForm(form);

  const updateUserKeys = (newStorageData: any) => {
    updateUserProfil({
      displayName: newStorageData.displayName,
    });
    setStorageKeys(newStorageData).then(() => {
      updateUser(newStorageData);
      route('/');
    });
  };

  const interests = [
    { name: 'Kultur', form: 'ta_culture' },
    { name: 'Romantik', form: 'ta_romance' },
    { name: 'Entspannung', form: 'ta_relaxe' },
    { name: 'Unterhaltung', form: 'ta_entertain' },
    { name: 'Action', form: 'ta_action' },
    { name: 'Sportlich', form: 'ta_sporty' },
    { name: 'Essen', form: 'ta_food' },
    { name: 'Tiere', form: 'ta_animals' },
    { name: 'Natur', form: 'el_nature' },
    { name: 'Wasser', form: 'el_water' },
    { name: 'Luft', form: 'el_air' },
    { form: 'lo_indoor', name: 'Drinnen' },
    { form: 'lo_outdoor', name: 'Draußen' },
  ];

  const updateProfile = () => {
    if (isValid()) {
      const displayName = `${fields.firstName} ${fields.lastName.charAt(0)}.`;
      updateUserProfil({ displayName }).then((userData: any) => {
        const uid = userData?.user?.uid;
        if (uid) {
          const newUser = {
            firstName: fields.firstName,
            lastName: fields.lastName,
            displayName,
            title: fields.title,
            plz: fields.plz,
            interests: fields.interests,
            phone: fields.phone,
            birthday: fields.birthday,
            uid,
          };

          fireDocument(`user/${uid}`, newUser, 'set');

          updateUserKeys({ displayName, interests: newUser.interests });
        } else {
          changeField('', 'password');
        }
      });
    }
  };

  return (
    <div class={`${style.profile} small_size_holder`}>

      <img class={style.logo} src="../../assets/logo/logo_farbe.svg" alt="guidex" />

      <form>

        <section class="group form">
          <h3>Für Deine Vorschläge</h3>

          <BasicInput
            type="number"
            label="Postleitzahl:"
            name="plz"
            value={fields.plz}
            placeholder="Deine Postleitzahl"
            error={formState.plz}
            autocomplete="postal-code"
            // errorMessage="Bitte gebe eine Postleitzahl an"
            required
            change={changeField}
          />

          <BasicInput
            type="date"
            label="Geburtstag:"
            name="birthday"
            value={fields.birthday}
            placeholder="Dein Geburtstag"
            error={formState.birthday}
            autocomplete="bday"
            // errorMessage="Bitte gebe Dein Geburtsdatum an"
            required
            change={changeField}
          />

          <PickInput
            label="Titel"
            name="title"
            options={['Herr', 'Frau']}
            value={fields.title}
            error={formState.title}
            // errorMessage="Bitte wähle Deinen Titel"
            required
            change={changeField}
          />

          <PickInput
            label="Wähle Deine Interessen"
            name="interests"
            options={interests.map((x) => x.name)}
            value={fields.interests}
            error={formState.interests}
            // errorMessage="Bitte wähle Deine Interessen"
            required
            change={changeField}
          />
        </section>

        <section class="group form">
          <h3>Für die Reservierungen</h3>
          <BasicInput
            type="text"
            label="Vorname:"
            name="firstName"
            autocomplete="given-name"
            value={fields.firstName}
            placeholder="Deinen Vornamen"
            error={formState.firstName}
            // errorMessage="Bitte gebe ein Vornamen an"
            required
            change={changeField}
          />

          <BasicInput
            type="text"
            label="Nachname:"
            name="lastName"
            autocomplete="family-name"
            value={fields.lastName}
            placeholder="Deinen Nachnamen"
            error={formState.lastName}
            // errorMessage="Bitte gebe ein Nachnamen an"
            required
            change={changeField}
          />

          <BasicInput
            type="tel"
            label="Telefon:"
            name="phone"
            value={fields.phone}
            placeholder="Deine Telefon-Nr."
            error={formState.phone}
            autocomplete="tel"
            // errorMessage="Bitte gebe eine Telefon-Nr. an"
            required
            change={changeField}
          />
        </section>

        <FormButton action={updateProfile} label="Profil aktuallisieren" />

      </form>

    </div>
  );
};

export default Profile;
