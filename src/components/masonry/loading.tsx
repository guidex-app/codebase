import { FunctionalComponent, h } from 'preact';
import style from './style.module.css';

const Loading: FunctionalComponent = () => (
  <div class={style.masonryList}>
    <div class={style.chunk}>
      {['item_0', 'item_1', 'item_2', 'item_3', 'item_4', 'item_5', 'item_6'].map((item: string) => (
        <div key={item} class={style[item]} style={{ backgroundColor: '#2b303d', borderRadius: '20px' }} />
      ))}
    </div>
  </div>
);

export default Loading;
