import { FunctionalComponent, h } from 'preact';

import style from './style.module.css';

interface SliderProps {
    images: string[];
    height?: number;
}

const Slider: FunctionalComponent<SliderProps> = ({ images, height = 400 }: SliderProps) => (
  <div class={style.slider} style={{ height: `${height}px` }}>
    {images.map((image: string) => (
      <img src={image} alt="" />
    ))}
  </div>
);

export default Slider;
