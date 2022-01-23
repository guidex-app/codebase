import { FunctionalComponent, h } from 'preact';
import { Link, route } from 'preact-router';
import { useEffect } from 'preact/hooks';
import FormButton from '../../components/form/basicButton';
import BasicInput from '../../components/form/basicInput';
import { loginUser, logoutUser } from '../../data/auth';
import { setStorageKeys } from '../../data/localStorage';
import useForm from '../../hooks/useForm';
import { FormInit } from '../../interfaces/form';
import { User } from '../../interfaces/user';
import style from './style.module.css';

interface SignInProps {
    updateUser: (data: User) => void;
    logout?: string;
}

const SignIn: FunctionalComponent<SignInProps> = ({ updateUser, logout }: SignInProps) => {
  const form: FormInit = {
    email: { type: 'email', required: true },
    password: { type: 'password', required: true },
  };
  const { fields, formState, changeField, isValid } = useForm(form);

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
    if (isValid()) {
      loginUser(fields.email, fields.password).then((userData: any) => {
        console.log(userData);
        if (userData) {
          updateUserKeys({ email: fields.email, displayName: userData.displayName, uid: userData.uid });
        } else {
          changeField('', 'password');
        }
      });
    }
  };

  if (logout === 'logout') return <div />;

  return (
    <div class={`${style.signIn} mini_size_holder`}>

      <img class={style.logo} src="../../assets/logo/logo_farbe.svg" alt="guidex" />

      <form>
        <BasicInput
          label="E-Mail"
          name="email"
          value={fields.email}
          error={formState.email}
          autocomplete="username"
          placeholder="Gebe eine E-Mail an"
          required
          change={changeField}
        />

        <BasicInput
          label="Passwort"
          name="password"
          type="password"
          value={fields.password}
          error={formState.password}
          autocomplete="new-password"
          placeholder="Dein Passwort"
          required
          change={changeField}
        />

        <FormButton action={logIn} label="Einloggen" />

        <div class={style.register}>
          <p>Du hast noch keinen Account? <Link href="/register">Registrieren</Link></p>
        </div>

      </form>

    </div>
  );
};

export default SignIn;
