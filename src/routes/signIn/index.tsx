import { IconKey, IconLockOpenOff, IconLogin, IconMailbox } from '@tabler/icons';
import { FunctionalComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';
import { route } from 'preact-router';

import FormButton from '../../components/form/basicButton';
import NormalInput from '../../components/form/Inputs/basic';
import Item from '../../components/item';
import { loginUser, logoutUser } from '../../data/auth';
import { setStorageKeys } from '../../data/localStorage';
import useForm from '../../hooks/useForm';
import { User } from '../../interfaces/user';
import style from './style.module.css';

interface SignInProps {
    updateUser: (data: User) => void;
    logout?: string;
}

const SignIn: FunctionalComponent<SignInProps> = ({ updateUser, logout }: SignInProps) => {
  const { form, changeForm, isValid } = useForm(undefined, ['email', 'password']);

  const updateUserKeys = (newStorageData: { email: string, displayName: string, uid: string }) => {
    setStorageKeys(newStorageData).then(() => {
      updateUser(newStorageData);
      route('/');
    });
  };

  const logOutCurrentUser = () => {
    logoutUser();
    updateUserKeys({ email: '', displayName: '', uid: '' });
  };

  useEffect(() => {
    if (logout === 'logout') logOutCurrentUser();
  }, []);

  const logIn = () => {
    if (isValid) {
      loginUser(form.email, form.password).then((userData: any) => {
        console.log(userData);
        if (userData) {
          updateUserKeys({ email: form.email, displayName: userData.displayName, uid: userData.uid });
        } else {
          changeForm('', 'password');
        }
      });
    }
  };

  if (logout === 'logout') return <div />;

  return (
    <div class={`${style.signIn} mini_size_holder`}>

      <img class={style.logo} src="../../assets/logo/logo_farbe.svg" alt="guidex" />

      <form>
        <NormalInput
          icon={<IconMailbox />}
          label="E-Mail"
          name="email"
          type="email"
          group
          value={form?.email}
          autocomplete="username"
          placeholder="Bitte gebe deine E-Mail an"
          required
          change={changeForm}
        />

        <NormalInput
          icon={<IconLockOpenOff />}
          label="Passwort"
          name="password"
          type="password"
          value={form?.password}
          autocomplete="new-password"
          placeholder="Bitte gebe dein Passwort ein"
          required
          change={changeForm}
        />

        <FormButton action={logIn} disabled={!isValid} label="Einloggen" />

        <Item type="info" icon={<IconLogin color="#2fd159" />} label="Als Nutzer registrieren" action={() => route('/register')} />
        <Item type="info" icon={<IconKey color="var(--orange)" />} label="Ihre Freizeitunternehmung anmelden" action={() => route('/register/company')} />

      </form>

    </div>
  );
};

export default SignIn;
