import { FunctionalComponent, h } from 'preact';
import { Route, route } from 'preact-router';
import { Mail, Key, Navigation2, Gift } from 'react-feather';
import BackButton from '../../components/backButton';
import FormButton from '../../components/form/basicButton';
import BasicInput from '../../components/form/basicInput';
import PickInput from '../../components/form/pickInput';
import { createUser, updateUserProfil } from '../../data/auth';
import { fireDocument } from '../../data/fire';
import { setStorageKeys } from '../../data/localStorage';
import useForm from '../../hooks/useForm';
import { FormInit } from '../../interfaces/form';
import { User } from '../../interfaces/user';
import style from './style.module.css';

interface RegisterProps {
    updateUser: (data: User) => void;
}

const Register: FunctionalComponent<RegisterProps> = ({ updateUser }: RegisterProps) => {
  const form: FormInit = {
    firstName: { type: 'string', required: true },
    lastName: { type: 'string', required: true },
    title: { value: 'Herr', type: 'string', required: true },
    email: { type: 'email', required: true },
    password: { type: 'password', required: true },
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

  const register = () => {
    if (isValid()) {
      createUser(fields.email, fields.password).then((userData: any) => {
        const uid = userData?.user?.uid;
        if (uid) {
          const newUser = {
            firstName: fields.firstName,
            lastName: fields.lastName,
            displayName: `${fields.firstName} ${fields.lastName.charAt(0)}.`,
            title: fields.title,
            email: fields.email,
            plz: fields.plz,
            interests: fields.interests,
            phone: fields.phone,
            birthday: fields.birthday,
            uid,
          };

          fireDocument(`user/${uid}`, newUser, 'set');

          updateUserKeys({ email: newUser.email, displayName: newUser.displayName, interests: newUser.interests });
        } else {
          changeField('', 'password');
        }
      });
    }
  };

  return (
    <div class={`${style.register} small_size_holder`}>
      <BackButton url="/login" />
      <img class={style.logo} src="../../assets/logo/logo_farbe.svg" alt="guidex" />

      <form>
        <section class="group form">
          <h3>Dein Login</h3>
          <BasicInput
            label="E-Mail"
            name="email"
            icon={<Mail />}
            value={fields.email}
            error={formState.email}
            autocomplete="email"
            placeholder="Gebe eine E-Mail an"
            required
            change={changeField}
          />

          <BasicInput
            icon={<Key />}
            label="Passwort"
            name="password"
            type="password"
            value={fields.password}
            error={formState.password}
            autocomplete="current-password"
            placeholder="Neues Passwort"
            required
            change={changeField}
          />
        </section>

        <section class="group form">
          <h3>Für Deine Vorschläge</h3>

          <BasicInput
            type="number"
            label="Postleitzahl:"
            name="plz"
            icon={<Navigation2 />}
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
            icon={<Gift />}
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

        <FormButton action={register} label="Registrieren" />

      </form>

    </div>
  );
};

export default Register;
