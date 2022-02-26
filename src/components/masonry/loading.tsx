import { FunctionalComponent, h } from 'preact';

import style from './style.module.css';

const Loading: FunctionalComponent = () => (
  <div class={style.masonryList}>
    <div class={style.chunk}>
      {['linear-gradient(135deg, #766166, #683835)', 'linear-gradient(135deg, #7d4241, #573043)', 'linear-gradient(135deg, #7f403b, #683735)', 'linear-gradient(135deg, #804e2f, #492952)', 'linear-gradient(135deg, #623954, #472952)', 'linear-gradient(135deg, #533647, #3b2356)', 'linear-gradient(135deg, #633d39, #3d2355)'].map((item: string, index: number) => (
        <div key={`item_${index.toString()}`} class={style[`item_${index}`]} style={{ borderRadius: '20px', background: item }} />
      ))}
    </div>
  </div>
);

export default Loading;
