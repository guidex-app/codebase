import { IconGift, IconKey, IconLocation, IconMail, IconPhone, IconUser } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';

import BackButton from '../../components/backButton';
import FormButton from '../../components/form/basicButton';
import NormalInput from '../../components/form/Inputs/basic';
import PickInput from '../../components/form/pickInput';
import Modal from '../../container/modal';
import { createUser, updateUserProfil } from '../../data/auth';
import { fireDocument } from '../../data/fire';
import { setStorageKeys } from '../../data/localStorage';
import useForm from '../../hooks/useForm';
import { User } from '../../interfaces/user';
import Confirmation from './confirmation';
import style from './style.module.css';

interface RegisterProps {
    company: string;
    updateUser: (data: User) => void;
}

const Register: FunctionalComponent<RegisterProps> = ({ updateUser, company }: RegisterProps) => {
  const { form, changeForm, isValid } = useForm({
    // for all
    email: undefined,
    password: undefined,

    // for users
    title: 'Herr',
    plz: '',
    birthday: '',
    interests: [],

    // for reservation
    firstName: undefined,
    lastName: undefined,
    phone: undefined,

    // for company
    companyFirstName: undefined,
    companyLastName: undefined,
    companyPhone: undefined,
  }, ['email', 'password']);
  const [success, setSuccess] = useState(false);

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
    if (isValid) {
      createUser(form.email, form.password).then((userData: any) => {
        const uid = userData?.user?.uid;
        if (uid) {
          const newUser: any = {
            displayName: `${company ? form.companyFirstName : form.firstName} ${company ? form.companyLastName.charAt(0) : form.lastName.charAt(0)}.`,
            email: form.email,
            uid,

            ...(company ? {
              companyFirstName: form.companyFirstname,
              companyLastName: form.companyLastName,
              companyPhone: form.companyPhone,
            } : {
              firstName: form.firstName,
              lastName: form.lastName,
              title: form.title,
              plz: form.plz,
              birthday: form.birthday,
              interests: form.interests,
              phone: form.phone,
            }),
          };

          fireDocument(`user/${uid}`, newUser, 'set').then(() => {
            setSuccess(true);
          });

          updateUserKeys({ email: newUser.email, displayName: newUser.displayName, ...(newUser.interests ? { interests: newUser.interests } : {}) });
        } else {
          changeForm('', 'password');
        }
      });
    }
  };

  return (
    <div class={`${style.register} small_size_holder`}>
      <BackButton url="/login" />

      <img class={style.logo} src="../../assets/logo/logo_farbe.svg" alt="guidex" />

      <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>{company ? 'Ihr Partner-Konto erstellen' : 'Ihr Nutzer-Konto erstellen'}</h1>

      <form>
        <section class="group form">
          <h3>Dein Login</h3>
          <NormalInput
            label="E-Mail"
            name="email"
            icon={<IconMail />}
            value={form.email}
            group
            autocomplete="email"
            placeholder="Gebe eine E-Mail an"
            required
            change={changeForm}
          />

          <NormalInput
            icon={<IconKey />}
            label="Passwort"
            name="password"
            type="password"
            value={form.password}
            autocomplete="current-password"
            placeholder="Neues Passwort"
            required
            change={changeForm}
          />
        </section>

        {company ? (
          <section class="group form">
            <h3>Ansprechpartner</h3>

            <NormalInput
              type="string"
              label="Vorname:"
              name="companyFirstName"
              group
              icon={<IconUser />}
              value={form.companyFirstName}
              placeholder="Dein Vorname"
              required
              change={changeForm}
            />

            <NormalInput
              type="string"
              label="Nachname:"
              name="companyLastName"
              icon={<IconUser />}
              value={form.companyLastName}
              placeholder="Dein Name"
              required
              change={changeForm}
            />

            <NormalInput
              type="phone"
              label="Telefonnummer:"
              name="companyPhone"
              icon={<IconPhone />}
              value={form.companyPhone}
              placeholder="Deine Telefonnummer"
              required
              change={changeForm}
            />

          </section>
        ) : (
          <Fragment>
            <section class="group form">
              <h3>Für Deine Vorschläge</h3>

              <NormalInput
                type="number"
                label="Postleitzahl:"
                name="plz"
                icon={<IconLocation />}
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
                icon={<IconGift />}
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
                group
                autocomplete="given-name"
                value={form.firstName}
                placeholder="Deinen Vornamen"
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
          </Fragment>
        )}

        <FormButton action={register} label="Registrieren und loslegen" />

      </form>

      {success && (
        <Modal title="" close={() => setSuccess(false)}>
          <Confirmation />
        </Modal>
      )}

    </div>
  );
};

export default Register;
