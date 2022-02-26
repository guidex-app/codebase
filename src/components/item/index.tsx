import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router/match';

import style from './style.module.css';

interface ItemProps {
    label: string;
    text?: string;
    action?: () => void;
    link?: string;
    icon?: any;
    image?: string;
    type?: 'grey' | 'large' | 'info' | 'clean' | 'warning';
}

const Item: FunctionalComponent<ItemProps> = ({ label, image, icon, type = 'clean', action, link, text }: ItemProps) => (
  <Link class={`${style.item} ${style[type] || ''}`} href={link} activeClassName={link ? style.current : undefined} onClick={action}>
    {image ? (
      <picture class={style.image}>
        <source srcSet={`${image}.webp?alt=media`} type="image/webp" />
        <img loading="lazy" src={`${image}.jpeg?alt=media`} alt={label} />
      </picture>
    ) : (
      icon && icon
    )}
    <p>{label}&nbsp; {text && <small>{text}</small>}</p>
  </Link>
);

export default Item;
