import { FunctionalComponent, h } from 'preact';

import style from './style.module.css';

interface SpinnerProps {
  gap?: number;
}

const Spinner: FunctionalComponent<SpinnerProps> = ({ gap = 60 }: SpinnerProps) => (
  <div class={style.loader} key="loader" style={{ margin: `${gap}px auto` }}>

    <svg viewBox="0 0 24 24">
      <defs>
        <linearGradient id="grad1">
          <stop offset="0%" stopColor="#fe7860" />
          <stop offset="100%" stopColor="#f62472" />
        </linearGradient>
      </defs>
      <path stroke="url(#grad1)" d="M17.788 5.108a9 9 0 1 0 3.212 6.892h-8" />
    </svg>

  </div>
);

export default Spinner;
