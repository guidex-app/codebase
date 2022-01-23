import { FunctionalComponent, h } from 'preact';

interface HeaderProps {
    action?: () => void;
}

const Overlay: FunctionalComponent<HeaderProps> = ({ action }: HeaderProps) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 60,
      overscrollBehavior: 'contain',
      cursor: 'pointer',
    }}
    onClick={action}
    role="presentation"
  />
);

export default Overlay;
