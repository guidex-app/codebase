import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';

import FormButton from '../form/basicButton';

interface MessageButtonProps {
  title: string;
  text: string;
  subTitle?: string;
  buttonText?: string;
//   icon?: string;
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
    <div className="small_size_holder" style={{ maxWidth: '350px' }}>
      {imageUrl && <img src={imageUrl} style={{ maxWidth: '100px', display: 'inline-block', marginBottom: '20px' }} alt={title} />}

      <h2>{title}</h2>
      <small>
        {subTitle && <strong>{subTitle}<br /></strong>}
        {text}
      </small>
      <br /><br />

      {(link || action) && (
      <FormButton label={buttonText} action={buttonClick} />
      )}
    </div>
  );
};

export default MessageButton;
