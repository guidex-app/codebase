import { IconCompass, IconHeart, IconIndentDecrease, IconLock, IconLogin, IconLogout, IconTools, IconUser, IconUserSearch } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { createPortal } from 'preact/compat';
import { useEffect, useRef, useState } from 'preact/hooks';
import { route } from 'preact-router';

import Item from '../item';
import Overlay from '../overlay';
import style from './style.module.css';

interface MenuProps {
  uid?: string;
}

const Menu: FunctionalComponent<MenuProps> = ({ uid }: MenuProps) => {
  const [show, setShow] = useState<boolean>(false);
  const container = useRef<any>(null);

  const routes: { title: string; link: string; icon: any }[] = [
    { title: 'Für mich', link: '/', icon: <IconCompass /> },
    { title: 'Listen', link: '/lists', icon: <IconHeart /> },
    { title: 'Entdecken', link: '/explore', icon: <IconUserSearch /> },
  ];

  const userRoutes: { title: string; link: string; icon: any }[] = [
    // { title: 'Listen', link: '/lists', icon: <Bookmark /> },
    // { title: 'Einstellungen', link: '/settings', icon: <Settings /> },
    { title: 'Profile', link: '/profile', icon: <IconUser /> },
    { title: 'Erlebnisse verwalten', link: '/company', icon: <IconTools /> },
  ];

  const getElement = () => {
    container.current = typeof window !== 'undefined' && document?.getElementById('modals');
  };

  useEffect(() => { if (!container.current) getElement(); }, []);
  // useEffect(() => { checkUserState(); }, [uid]);

  const toggleModal = () => setShow(!show);

  return (
    <Fragment>
      <div class={style.button}>
        <button onClick={() => route('/')} type="button" aria-label="Menü">
          <img class={style.logo} src="../../assets/logo/logo_farbe.svg" alt="guidex" />
        </button>

        <button onClick={() => route('/lists')} type="button" aria-label="Menü">
          <IconHeart />
        </button>
        <button onClick={() => route('/explore')} type="button" aria-label="Menü">
          <IconUserSearch />
        </button>
        <button onClick={toggleModal} class={style.openMenu} type="button" aria-label="Menü">
          <IconIndentDecrease />
        </button>
      </div>

      {show && container.current && createPortal(
        (
          <Fragment>
            <Overlay action={toggleModal} />
            <aside class={style.menu}>
              <h1 class={style.title}>Guidex</h1>
              <small>Willkommen {uid ? 'zurück' : 'auf Guidex'}</small>
              <nav style={{ padding: '0 4px' }}>
                {routes.map((item: { title: string; link: string; icon: any }) => (
                  <Item key={item.title} label={item.title} icon={item.icon} link={item.link} action={toggleModal} />
                ))}

                {uid ? (
                  <Fragment>
                    <h4>Account</h4>
                    {userRoutes.map((item: { title: string; link: string; icon: any }) => (
                      <Item key={item.title} label={item.title} icon={item.icon} link={item.link} action={toggleModal} />
                    ))}
                    {uid === 'rGp6VBgqJBekDWCALsLHZbuhb2m1' && (
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
