import { ComponentChildren, Fragment, FunctionalComponent, h } from 'preact';
import { createPortal } from 'preact/compat';

import Overlay from '../../components/overlay';
import style from './style.module.css';

interface PopupProps {
    close: () => void;
    children: ComponentChildren;
}

const Popup: FunctionalComponent<PopupProps> = ({ close, children }) => {
  const container: any = document?.getElementById('popups');

  return container && createPortal(
    (
      <Fragment>
        <Overlay action={close} isPopup />
        <div class={style.popup}>
          <div class={style.content}>{children}</div>
        </div>
      </Fragment>
    ), container,
  );
};

export default Popup;
