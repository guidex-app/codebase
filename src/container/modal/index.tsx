import { ComponentChildren, Fragment, FunctionalComponent, h } from 'preact';
import { createPortal } from 'preact/compat';

import Header from '../../components/header';
import Overlay from '../../components/overlay';
import style from './style.module.css';

interface ModalProps {
    title: string;
    close: () => void;
    type?: 'large' | 'small';
    background?: string;
    children: ComponentChildren;
}

const Modal: FunctionalComponent<ModalProps> = ({ close, title, children, background, type }) => {
  const container: any = document?.getElementById('modals');

  return container && createPortal(
    (
      <Fragment>
        <Overlay action={close} />
        <div class={`${style.modal} ${type ? style[type] : ''}`}>
          <Header title={title} action={close} background={background} />
          <div class={style.content}>{children}</div>
        </div>
      </Fragment>
    ), container,
  );
};

export default Modal;
