import { FunctionalComponent, h } from 'preact';

interface ErrorMessageProps {
    show?: boolean;
    message?: string | undefined;
}

const ErrorMessage: FunctionalComponent<ErrorMessageProps> = ({ show, message = 'Bitte mache eine korrekte eingabe' }: ErrorMessageProps) => {
  if (!show) return null;
  return (
    <small style={{
      display: 'block',
      color: 'rgba(252, 66, 75, 0.5)',
      margin: '-10px 0 10px 0',
    }}
    >{message}
    </small>
  );
};

export default ErrorMessage;
