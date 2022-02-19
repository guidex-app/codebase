import { h } from 'preact';
import { Calendar, Clock, Coffee, DollarSign, Feather, Home, Sun, Thermometer, UserCheck, UserPlus } from 'react-feather';

import { Filter } from '../interfaces/filter';

const catFilter: Filter[][] = [[
  { title: { name: 'Wetter', form: 'we', icon: <Sun color="#fea00a" /> },
    inputType: 'checkbox',
    data: [
      { name: 'Sonnig', form: 'we_sunny' },
      { name: 'Regen', form: 'we_rainy' },
      { name: 'Bewölkt', form: 'we_cloudy' },
      { name: 'Schnee', form: 'we_snowy' },
    ] },
  { title: { name: 'Temperatur', form: 'te', icon: <Thermometer color="#fea00a" /> },
    inputType: 'checkbox',
    data: [
      { name: 'Wärmer als 20°', form: 'te_sommerlaune' },
      { name: '15° - 20°', form: 'te_nordisch' },
      { name: '10° - 14°', form: 'te_wetterfrei' },
      { name: 'Kälter als 10°', form: 'te_frostigefreude' },
    ] },
  { title: { name: 'Tageszeit', form: 'tz', icon: <Calendar color="#fea00a" /> },
    inputType: 'checkbox',
    data: [
      { name: 'Morgens', form: 'tz_morgens' },
      { name: 'Mittags', form: 'tz_mittags' },
      { name: 'Abends', form: 'tz_abends' },
      { name: 'Nachts', form: 'tz_nachts' },
    ] },
], [
  { title: { name: 'Interessen', form: 'ta', icon: <Coffee color="#2fd159" /> },
    inputType: 'checkbox',
    data: [
      { name: 'Kultur', form: 'ta_culture' },
      { name: 'Romantik', form: 'ta_romance' },
      { name: 'Entspannung', form: 'ta_relaxe' },
      { name: 'Unterhaltung', form: 'ta_entertain' },
      { name: 'Action', form: 'ta_action' },
      { name: 'Sportlich', form: 'ta_sporty' },
      { name: 'Essen', form: 'ta_food' },
      { name: 'Tiere', form: 'ta_animals' },
    ] },
  { title: { name: 'Elemente', form: 'el', icon: <Feather color="#2fd159" /> },
    inputType: 'checkbox',
    data: [
      { name: 'Natur', form: 'el_nature' },
      { name: 'Wasser', form: 'el_water' },
      { name: 'Luft', form: 'el_air' },
    ] },
  { title: { name: 'Draußen/Drinnen', form: 'lo', icon: <Home color="#2fd159" /> },
    inputType: 'checkbox',
    data: [
      { form: 'lo_indoor', name: 'Drinnen' },
      { form: 'lo_outdoor', name: 'Draußen' },
    ] },
], [
  { title: { name: 'Alter', form: 'ag', icon: <UserPlus color="#0983fe" /> },
    inputType: 'checkbox',
    data: [
      { name: 'Baby', form: 'ag_baby' },
      { name: 'Kleinkind', form: 'ag_infant' },
      { name: 'Schulkind', form: 'ag_school' },
      { name: 'Teenager', form: 'ag_teen' },
      { name: 'Erwachsen', form: 'ag_adult' },
    ] },
  { title: { name: 'Preis', form: 'pr', icon: <DollarSign color="#0983fe" /> },
    inputType: 'radio',
    data: [
      { form: 'pr_price_0', name: 'Kostenfrei' },
      { form: 'pr_price_1', name: '0 - 25 €' },
      { form: 'pr_price_2', name: '25 - 50 €' },
      { form: 'pr_price_3', name: '50 - 75 €' },
      { form: 'pr_price_4', name: '75 - 100 €' },
      { form: 'pr_price_5', name: 'Über 100 €' },
    ] },
  { title: { name: 'Personen', form: 'pe', icon: <UserCheck color="#0983fe" /> },
    inputType: 'radio',
    data: [
      { form: 'pe_eine_pers', name: '1 Pers.' },
      { form: 'pe_zwei_pers', name: '2 Pers.' },
      { form: 'pe_drei_per', name: '3 Pers.' },
      { form: 'pe_vier_pers', name: '4 Pers.' },
      { form: 'pe_fuenf_pers', name: '5 Pers.' },
      { form: 'pe_ueberfuenf_pers', name: 'Über 5 Pers.' },
    ] },
  { title: { name: 'Dauer', form: 'du', icon: <Clock color="#0983fe" /> },
    inputType: 'radio',
    data: [
      { form: 'du_halbestunde', name: '30 Min.' },
      { form: 'du_stunde', name: '1 Std.' },
      { form: 'du_zweistunden', name: '2 Std.' },
      { form: 'du_dreistunden', name: '3 Std.' },
      { form: 'du_vierstunden', name: '4 Std.' },
      { form: 'du_more', name: 'Über 4 Std.' },
    ] },
]];

export default catFilter;
