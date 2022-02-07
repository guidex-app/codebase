import { Fragment, FunctionalComponent, h } from 'preact';
import { createPortal } from 'preact/compat';
import { useEffect, useRef, useState } from 'preact/hooks';
import { Compass, Globe, Grid, Home, Lock, LogIn, LogOut, Paperclip, User } from 'react-feather';

import { getUser } from '../../data/auth';
import Item from '../item';
import Overlay from '../overlay';
import style from './style.module.css';

const Menu: FunctionalComponent = () => {
  const [user, setUser] = useState<{
    email: string,
    displayName: string,
  } | undefined>(undefined);
  const [show, setShow] = useState<boolean>(false);
  const container = useRef<any>(null);

  const routes: { title: string; link: string; icon: any }[] = [
    { title: 'Für mich', link: '/', icon: <Compass /> },
    { title: 'Entdecken', link: '/explore', icon: <Globe /> },
  ];

  const userRoutes: { title: string; link: string; icon: any }[] = [
    // { title: 'Listen', link: '/lists', icon: <Bookmark /> },
    // { title: 'Einstellungen', link: '/settings', icon: <Settings /> },
    { title: 'Profile', link: '/profile', icon: <User /> },
    { title: 'Verwaltung', link: '/company', icon: <Paperclip /> },
  ];

  const checkUserState = async (): Promise<void> => {
    const { displayName, email } = await getUser();
    container.current = typeof window !== 'undefined' && document?.getElementById('modals');
    if (displayName && email) setUser(displayName && email ? { displayName, email } : undefined);
  };

  useEffect(() => { if (!user) checkUserState(); }, [show]);

  const toggleModal = () => setShow(!show);

  return (
    <Fragment>
      <button class={style.button} onClick={toggleModal} type="button" aria-label="Menü">
        <Grid color="#FFFFFF" size="24" />
      </button>

      {show && container.current && createPortal(
        (
          <Fragment>
            <Overlay action={toggleModal} />
            <aside class={style.menu}>
              <h1 class={style.title}>Guidex</h1>
              {user && <small>Willkommen {user?.displayName?.split(' ')?.[0] || ''}</small>}
              <nav>
                {routes.map((item: { title: string; link: string; icon: any }) => (
                  <Item key={item.title} label={item.title} icon={item.icon} link={item.link} action={toggleModal} />
                ))}

                {user ? (
                  <Fragment>
                    <h4>Account</h4>
                    {userRoutes.map((item: { title: string; link: string; icon: any }) => (
                      <Item key={item.title} label={item.title} icon={item.icon} link={item.link} action={toggleModal} />
                    ))}
                    {user.email.endsWith('@guidex.app') && (
                    <Item label="Admin" icon={<Lock />} link="/admin" action={toggleModal} />
                    )}
                    <Item label="Ausloggen" icon={<LogOut />} link="/logout" action={toggleModal} />
                  </Fragment>
                ) : (
                  <Item label="Einloggen" icon={<LogIn />} link="/login/" action={toggleModal} />
                )}

              </nav>
            </aside>
          </Fragment>
        ),
        container.current,
      )}
    </Fragment>
  );
};

export default Menu;
