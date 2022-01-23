import { FunctionalComponent, h } from 'preact';
import style from './style.module.css';

interface FabButtonProps {
    icon: any;
    hide?: boolean;
    action: () => void;
}

const FabButton: FunctionalComponent<FabButtonProps> = ({ icon, hide = false, action }: FabButtonProps) => (
  <button class={`${style.fabButton} ${hide ? style.hide : ''}`} onClick={action} aria-label="Filter öffnen" type="button">
    {icon}
  </button>
);

export default FabButton;
