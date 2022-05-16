import { IconChartPie, IconPin, IconSun } from '@tabler/icons';
import { FunctionalComponent, h } from 'preact';

import style from './style.module.css';

interface IconScrollListProp {
    filter?: string[];
}

const IconScrollList: FunctionalComponent<IconScrollListProp> = ({ filter }: IconScrollListProp) => {
  const iconMap: any = {
    Geburtstagsfeiern: <IconChartPie color="var(--fifth)" />,
    'Öffentliche Toiletten': <IconPin color="var(--fifth)" />,
    Outdoor: <IconSun />,
  };

  return (
    <div class={style.slider}>
      {filter?.map((x: string) => (
        <div>{iconMap[x] || <IconSun color="var(--fifth)" />}<br /><small>{x}</small></div>
      ))}
    </div>
  );
};

export default IconScrollList;
