import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

import style from './style.module.css';

interface TextHeaderProps {
    title: string;
    text: string;
    shorten?: true;
    icon?: any;
    image?: string;
}

const TextHeader: FunctionalComponent<TextHeaderProps> = ({ title, text, shorten, image, icon }: TextHeaderProps) => {
  const [hideText, setHideText] = useState(!!shorten);

  return (
    <header class={`${style.textHeader} small_size_holder ${shorten && hideText ? style.hideText : ''}`}>

      {image ? (
        <picture class={style.image}>
          <source srcSet={`${image}.webp?alt=media`} type="image/webp" />
          <img loading="lazy" src={`${image}.jpeg?alt=media`} alt={title} />
        </picture>
      ) : (
        icon && icon
      )}
      {/* <div onClick={() => shorten && setHideText(!hideText)} class={shorten && hideText ? style.hideText : ''} role="button" tabIndex={0}> */}
      <h1>{title}&nbsp;</h1>
      <p>{shorten && hideText ? `${text.substring(0, 275)}...` : text}</p>
      {/* </div> */}

      {shorten && <button type="button" onClick={() => shorten && setHideText(!hideText)}>{hideText ? 'Mehr' : 'Weniger'}</button>}
    </header>
  );
};

export default TextHeader;
