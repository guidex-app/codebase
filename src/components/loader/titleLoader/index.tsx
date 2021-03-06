import { h } from 'preact';

import style from './style.module.css';

const TitleLoader = () => (
  <div class="small_size_holder" style={{ padding: '60px' }}>
    <div class={style.loader}>
      <svg viewBox="0 0 24 24"><path d="M17.788 5.108a9 9 0 1 0 3.212 6.892h-8" /></svg>

    </div>
  </div>
);

export default TitleLoader;
