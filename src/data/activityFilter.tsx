import { h } from 'preact';
import { Sun, Thermometer } from 'react-feather';

import { Filter } from '../interfaces/filter';

const activityFilter: Filter[][] = [[
  { title: { name: 'Location', form: 'lo', icon: <Thermometer color="var(--orange)" /> },
    inputType: 'radio',
    data: [
      { name: 'Indoor', form: 'lo_indoor' },
      { name: 'Outdoor', form: 'lo_outdoor' },
    ] },
  { title: { name: 'Radius', form: 'ra', icon: <Sun color="var(--orange)" /> },
    inputType: 'radio',
    data: [
      { name: '5 km', form: 'ra_five' },
      { name: '10 km', form: 'ra_ten' },
      { name: '20 km', form: 'ra_twenty' },
    ] },
  { title: { name: 'Sortieren nach', form: 'so', icon: <Thermometer color="var(--orange)" /> },
    inputType: 'radio',
    data: [
      { name: 'Neuste', form: 'so_new' },
      { name: 'Distanz', form: 'so_distance' },
      { name: 'Bewertung', form: 'so_raiting' },
    ] },
]];

export default activityFilter;
