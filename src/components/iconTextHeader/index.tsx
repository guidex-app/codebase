import { Fragment, FunctionalComponent, h } from 'preact';
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
  const [showAll, setShowAll] = useState(!shorten);

  return (
    <header class={`${style.textHeader} small_size_holder`}>
      {image ? (
        <picture class={style.image}>
          <source srcSet={`${image}.webp?alt=media`} type="image/webp" />
          <img loading="lazy" src={`${image}.jpeg?alt=media`} alt={title} />
        </picture>
      ) : (
        icon && icon
      )}
      <div onClick={() => shorten && setShowAll(!showAll)} role="button" tabIndex={0}>
        <h1>{title}&nbsp;</h1>
        <p>{shorten ? text.substring(0, 200) : text}
          {shorten && !showAll && (
          <Fragment>
            ... <span class={style.showMore}>Mehr erfahren</span>
          </Fragment>
          )}
          {shorten && <span>{text.substring(200)}</span>}
        </p>
      </div>
    </header>
  );
};

export default TextHeader;
