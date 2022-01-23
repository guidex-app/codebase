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
    type?: 'active' | 'grey' | 'large';
}

const Item: FunctionalComponent<ItemProps> = ({ label, image, icon, type, action, link, text }: ItemProps) => (
  <Link class={`${style.link} ${type ? style[type] : ''}`} href={link} activeClassName={link ? style.current : undefined} onClick={action}>
    {image ? (
      <div class={style.image}>
        <picture>
          <source srcSet={`${image}.webp?alt=media`} type="image/webp" />
          <img loading="lazy" src={`${image}.jpeg?alt=media`} alt={label} />
        </picture>
      </div>
    ) : (
      icon && icon
    )}
    <div class={`${style.label} ${text ? style.text : ''}`}><p>{label}</p>{text && <small>{text}</small>}</div>
  </Link>
);

export default Item;
