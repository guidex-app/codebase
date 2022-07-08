import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';

import style from './style.module.css';

interface ItemProps {
    label: string;
    text?: string;
    action?: () => void;
    link?: string;
    icon?: any;
    editLabel?: string;
    image?: string;
    type?: 'grey' | 'large' | 'info' | 'clean' | 'warning' | 'success';
    background?: string;
}

const Item: FunctionalComponent<ItemProps> = ({ label, image, icon, editLabel, background, type = 'clean', action, link, text }: ItemProps) => {
  const clickFunc = async () => {
    if (link) route(link);
    if (action) action();
  };

  return (
    <div class={`${style.item} ${style[type] || ''}`} style={background ? { backgroundColor: background } : undefined} onClick={clickFunc} role="button" tabIndex={0}>
      {image ? (
        <picture class={style.image}>
          <source srcSet={`${image}.webp?alt=media`} type="image/webp" />
          <img loading="lazy" src={`${image}.jpeg?alt=media`} alt={label} />
        </picture>
      ) : (
        icon && icon
      )}
      <p style={!text ? { paddingTop: '16px' } : undefined}>{label}&nbsp; {text && <small>{text}</small>}</p>
      {editLabel && <div class={style.editLabel}>{editLabel}</div>}
    </div>
  );
};

export default Item;
