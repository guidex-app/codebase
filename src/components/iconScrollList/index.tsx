import { FunctionalComponent, h } from 'preact';
import { MapPin, PieChart, Sun } from 'react-feather';

import style from './style.module.css';

interface IconScrollListProp {
    filter?: string[];
}

const IconScrollList: FunctionalComponent<IconScrollListProp> = ({ filter }: IconScrollListProp) => {
  const iconMap: any = {
    Geburtstagsfeiern: <PieChart color="#6c7293" />,
    'Öffentliche Toiletten': <MapPin color="#6c7293" />,
    Outdoor: <Sun />,
  };

  return (
    <div class={style.slider}>
      {filter?.map((x: string) => (
        <div>{iconMap[x] || <Sun color="#6c7293" />}<br /><small>{x}</small></div>
      ))}
    </div>
  );
};

export default IconScrollList;
