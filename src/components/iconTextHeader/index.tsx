import { FunctionalComponent, h } from 'preact';
import style from './style.module.css';

interface TextHeaderProps {
    title: string;
    text: string;
    icon?: any;
}

const TextHeader: FunctionalComponent<TextHeaderProps> = ({ title, text, icon }: TextHeaderProps) => (
  <header class={`${style.textHeader} small_size_holder`}>
    {icon && icon}
    <div>
      <h1>{title}&nbsp;</h1>
      <p><strong>{text}</strong></p>
    </div>
  </header>
);

export default TextHeader;
