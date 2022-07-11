import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';

import FormButton from '../../form/basicButton';
import style from './style.module.css';

interface MessageButtonProps {
  title: string;
  text: string;
  subTitle?: string;
  buttonText?: string;
  imageUrl?: string;
  link?: string;
  action?: () => void;
}

const MessageButton: FunctionalComponent<MessageButtonProps> = ({ title, text, subTitle, imageUrl, action, link, buttonText = 'Hinzufügen' }: MessageButtonProps) => {
  const buttonClick = async () => {
    if (action) action();
    if (link) route(link);
  };

  return (
    <div class={`small_size_holder ${style.messageButton}`}>
      {imageUrl && <img src={imageUrl} alt={title} />}

      <h2>{title}</h2>
      <small>
        {subTitle && <strong>{subTitle}<br /></strong>}
        {text}
      </small>
      <br />

      {(link || action) && <FormButton label={buttonText} action={buttonClick} />}
    </div>
  );
};

export default MessageButton;
