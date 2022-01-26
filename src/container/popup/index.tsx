import { ComponentChildren, Fragment, FunctionalComponent, h } from 'preact';
import { createPortal } from 'preact/compat';
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
        <div class={style.overlay} onClick={close} role="presentation" />
        <div class={style.popup}>
          <div class={style.content}>{children}</div>
        </div>
      </Fragment>
    ), container,
  );
};

export default Popup;
