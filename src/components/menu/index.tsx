import { getAuth } from '@firebase/auth';
import { Fragment, FunctionalComponent, h } from 'preact';
import { createPortal } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
import { Globe, Grid, Home, Lock, LogIn, LogOut, Paperclip, User } from 'react-feather';
import fireConfig from '../../data/fireConfig';
import Item from '../item';
import Overlay from '../overlay';
import style from './style.module.css';

const Menu: FunctionalComponent = () => {
  const [user, setUser] = useState<{
    email: string,
    displayName: string,
  } | undefined>(undefined);
  const [show, setShow] = useState<boolean>(false);

  const routes: { title: string; link: string; icon: any }[] = [
    { title: 'Für mich', link: '/', icon: <Home /> },
    { title: 'Entdecken', link: '/explore', icon: <Globe /> },
  ];

  const userRoutes: { title: string; link: string; icon: any }[] = [
    // { title: 'Listen', link: '/lists', icon: <Bookmark /> },
    // { title: 'Einstellungen', link: '/settings', icon: <Settings /> },
    { title: 'Profile', link: '/profile', icon: <User /> },
    { title: 'Verwaltung', link: '/company', icon: <Paperclip /> },
  ];

  const checkUserState = () => {
    const auth = getAuth(fireConfig);
    console.log('check userState', auth);
    const { displayName, email } = auth.currentUser || {};
    console.log(displayName, email);
    return setUser(displayName && email ? { displayName, email } : undefined);
  };

  useEffect(() => {
    if (!user) checkUserState();
  }, [show]);

  const close = () => setShow(false);

  const container: any = typeof window !== 'undefined' && document?.getElementById('modals');

  return (
    <Fragment>
      <button class={style.button} onClick={() => setShow(true)} type="button" aria-label="Menü">
        <Grid color="#FFFFFF" size="24" />
      </button>

      {show && container && createPortal(
        (
          <Fragment>
            <Overlay action={close} />
            <aside class={style.menu}>
              <h1 class={style.title}>Guidex</h1>
              {user && <small>Willkommen {user?.displayName?.split(' ')?.[0] || ''}</small>}
              <nav>
                {routes.map((item: { title: string; link: string; icon: any }) => (
                  <Item key={item.title} label={item.title} icon={item.icon} link={item.link} action={close} />
                ))}

                {user ? (
                  <Fragment>
                    <h4>Account</h4>
                    {userRoutes.map((item: { title: string; link: string; icon: any }) => (
                      <Item key={item.title} label={item.title} icon={item.icon} link={item.link} action={close} />
                    ))}
                    {user.email.endsWith('@guidex.app') && (
                    <Item label="Admin" icon={<Lock />} link="/admin" action={close} />
                    )}
                    <Item label="Ausloggen" icon={<LogOut />} link="/logout" action={close} />
                  </Fragment>
                ) : (
                  <Item label="Einloggen" icon={<LogIn />} link="/login/" action={close} />
                )}

              </nav>
            </aside>
          </Fragment>
        ),
        container,
      )}
    </Fragment>
  );
};

export default Menu;
