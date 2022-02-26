import { FunctionalComponent, h } from 'preact';

import style from './style.module.css';

interface TextHeaderProps {
    title: string;
    text: string;
    icon?: any;
    image?: string;
}

const TextHeader: FunctionalComponent<TextHeaderProps> = ({ title, text, image, icon }: TextHeaderProps) => (
  <header class={`${style.textHeader} small_size_holder`}>
    {image ? (
      <picture class={style.image}>
        <source srcSet={`${image}.webp?alt=media`} type="image/webp" />
        <img loading="lazy" src={`${image}.jpeg?alt=media`} alt={title} />
      </picture>
    ) : (
      icon && icon
    )}
    <div>
      <h1>{title}&nbsp;</h1>
      <p>{text}</p>
    </div>
  </header>
);

export default TextHeader;
