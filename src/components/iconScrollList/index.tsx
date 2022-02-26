import { FunctionalComponent, h } from 'preact';
import { MapPin, PieChart, Sun } from 'react-feather';

import style from './style.module.css';

interface IconScrollListProp {
    filter?: string[];
}

const IconScrollList: FunctionalComponent<IconScrollListProp> = ({ filter }: IconScrollListProp) => {
  const iconMap: any = {
    Geburtstagsfeiern: <PieChart color="var(--fifth)" />,
    'Öffentliche Toiletten': <MapPin color="var(--fifth)" />,
    Outdoor: <Sun />,
  };

  return (
    <div class={style.slider}>
      {filter?.map((x: string) => (
        <div>{iconMap[x] || <Sun color="var(--fifth)" />}<br /><small>{x}</small></div>
      ))}
    </div>
  );
};

export default IconScrollList;
