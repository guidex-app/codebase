import { Fragment, FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';

import FormButton from '../../components/form/basicButton';
import NormalInput from '../../components/form/Inputs/basic';
import PickInput from '../../components/form/pickInput';
import { updateUserProfil } from '../../data/auth';
import { fireDocument } from '../../data/fire';
import { setStorageKeys } from '../../data/localStorage';
import useForm from '../../hooks/useForm';
import { User } from '../../interfaces/user';
import style from './style.module.css';

interface ProfileProps {
    updateUser: (data: User) => void;
}

const Profile: FunctionalComponent<ProfileProps> = ({ updateUser }: ProfileProps) => {
  const { form, changeForm, isValid } = useForm({
    firstName: undefined,
    lastName: undefined,
    title: undefined,
    plz: undefined,
    interests: [],
    phone: undefined,
    birthday: undefined,
  });

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
    if (isValid) {
      const displayName = `${form.firstName} ${form.lastName.charAt(0)}.`;
      updateUserProfil({ displayName }).then((userData: any) => {
        const uid = userData?.user?.uid;
        if (uid) {
          const newUser = {
            firstName: form.firstName,
            lastName: form.lastName,
            displayName,
            title: form.title,
            plz: form.plz,
            interests: form.interests,
            phone: form.phone,
            birthday: form.birthday,
            uid,
          };

          fireDocument(`user/${uid}`, newUser, 'set');

          updateUserKeys({ displayName, interests: newUser.interests });
        } else {
          changeForm('', 'password');
        }
      });
    }
  };

  return (
    <Fragment>

      <img class={style.logo} src="../../assets/logo/logo_farbe.svg" alt="guidex" />

      <form class="small_size_holder">

        <section class="group form">
          <h3>Für Deine Vorschläge</h3>

          <NormalInput
            type="number"
            label="Postleitzahl:"
            name="plz"
            value={form.plz}
            placeholder="Deine Postleitzahl"
            autocomplete="postal-code"
            // errorMessage="Bitte gebe eine Postleitzahl an"
            required
            change={changeForm}
          />

          <NormalInput
            type="date"
            label="Geburtstag:"
            name="birthday"
            value={form.birthday}
            placeholder="Dein Geburtstag"
            autocomplete="bday"
            // errorMessage="Bitte gebe Dein Geburtsdatum an"
            required
            change={changeForm}
          />

          <PickInput
            label="Titel"
            name="title"
            options={['Herr', 'Frau']}
            value={form.title}
            // errorMessage="Bitte wähle Deinen Titel"
            required
            change={changeForm}
          />

          <PickInput
            label="Wähle Deine Interessen"
            name="interests"
            options={interests.map((x) => x.name)}
            value={form.interests}
            // errorMessage="Bitte wähle Deine Interessen"
            required
            change={changeForm}
          />
        </section>

        <section class="group form">
          <h3>Für die Reservierungen</h3>
          <NormalInput
            type="string"
            label="Vorname:"
            name="firstName"
            autocomplete="given-name"
            value={form.firstName}
            placeholder="Deinen Vornamen"
            // errorMessage="Bitte gebe ein Vornamen an"
            required
            change={changeForm}
          />

          <NormalInput
            type="string"
            label="Nachname:"
            name="lastName"
            autocomplete="family-name"
            value={form.lastName}
            placeholder="Deinen Nachnamen"
            // errorMessage="Bitte gebe ein Nachnamen an"
            required
            change={changeForm}
          />

          <NormalInput
            type="phone"
            label="Telefon:"
            name="phone"
            value={form.phone}
            placeholder="Deine Telefon-Nr."
            autocomplete="tel"
            // errorMessage="Bitte gebe eine Telefon-Nr. an"
            required
            change={changeForm}
          />
        </section>

        <FormButton action={updateProfile} disabled={!isValid} label="Profil aktuallisieren" />

      </form>

    </Fragment>
  );
};

export default Profile;
