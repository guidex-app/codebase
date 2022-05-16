import { IconCompass, IconGlobe, IconLock, IconLogin, IconLogout, IconMenu, IconPaperclip, IconUser } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { createPortal } from 'preact/compat';
import { useEffect, useRef, useState } from 'preact/hooks';

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
    { title: 'Für mich', link: '/', icon: <IconCompass /> },
    { title: 'Entdecken', link: '/explore', icon: <IconGlobe /> },
  ];

  const userRoutes: { title: string; link: string; icon: any }[] = [
    // { title: 'Listen', link: '/lists', icon: <Bookmark /> },
    // { title: 'Einstellungen', link: '/settings', icon: <Settings /> },
    { title: 'Profile', link: '/profile', icon: <IconUser /> },
    { title: 'Verwaltung', link: '/company', icon: <IconPaperclip /> },
  ];

  const checkUserState = async (): Promise<void> => {
    const { displayName, email } = await getUser();
    if (displayName && email) setUser(displayName && email ? { displayName, email } : undefined);
  };

  const getElement = () => {
    container.current = typeof window !== 'undefined' && document?.getElementById('modals');
  };

  useEffect(() => { if (!user?.email) checkUserState(); }, [show]);
  useEffect(() => { if (!container.current) getElement(); }, []);

  const toggleModal = () => setShow(!show);

  return (
    <Fragment>
      <button class={style.button} onClick={toggleModal} type="button" aria-label="Menü">
        <IconMenu color="var(--white)" size="24" />
      </button>

      {show && container.current && createPortal(
        (
          <Fragment>
            <Overlay action={toggleModal} />
            <aside class={style.menu}>
              <h1 class={style.title}>Guidex</h1>
              <small>Willkommen {user?.displayName ? user?.displayName.split(' ')?.[0] : 'auf Guidex'}</small>
              <nav style={{ padding: '0 4px' }}>
                {routes.map((item: { title: string; link: string; icon: any }) => (
                  <Item key={item.title} label={item.title} icon={item.icon} link={item.link} action={toggleModal} />
                ))}

                {user?.email ? (
                  <Fragment>
                    <h4>Account</h4>
                    {userRoutes.map((item: { title: string; link: string; icon: any }) => (
                      <Item key={item.title} label={item.title} icon={item.icon} link={item.link} action={toggleModal} />
                    ))}
                    {user.email.endsWith('@guidex.app') && (
                    <Item label="Admin" icon={<IconLock />} link="/admin" action={toggleModal} />
                    )}
                    <Item label="Ausloggen" icon={<IconLogout />} link="/logout" action={toggleModal} />
                  </Fragment>
                ) : (
                  <Item label="Einloggen" icon={<IconLogin />} link="/login/" action={toggleModal} />
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
