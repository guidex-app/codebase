import { Cloud, Compass, Clock, UserPlus, CloudSnow, Sunrise, Droplet, Home, DollarSign } from 'react-feather';
import { Filter } from '../interfaces/filter';

const catFilter: Filter[][] = [[
  { title: { name: 'Wetter', form: 'we', icon: Cloud },
    inputType: 'checkbox',
    data: [
      { name: 'Sonnig', form: 'we_sunny', icon: Compass },
      { name: 'Regen', form: 'we_rainy', icon: Compass },
      { name: 'Bewölkt', form: 'we_cloudy', icon: Compass },
      { name: 'Schnee', form: 'we_snowy', icon: Compass },
    ] },
  { title: { name: 'Temperatur', form: 'te', icon: CloudSnow },
    inputType: 'checkbox',
    data: [
      { name: 'Wärmer als 20°', form: 'te_sommerlaune', icon: Compass },
      { name: '15° - 20°', form: 'te_nordisch', icon: Compass },
      { name: '10° - 14°', form: 'te_wetterfrei', icon: Compass },
      { name: 'Kälter als 10°', form: 'te_frostigefreude', icon: Compass },
    ] },
  { title: { name: 'Tageszeit', form: 'tz', icon: Clock },
    inputType: 'checkbox',
    data: [
      { name: 'Morgens', form: 'tz_morgens', icon: Compass },
      { name: 'Mittags', form: 'tz_mittags', icon: Compass },
      { name: 'Abends', form: 'tz_abends', icon: Compass },
      { name: 'Nachts', form: 'tz_nachts', icon: Compass },
    ] },
], [
  { title: { name: 'Tags', form: 'ta', icon: Sunrise },
    inputType: 'checkbox',
    data: [
      { name: 'Kultur', form: 'ta_culture', icon: Compass },
      { name: 'Romantik', form: 'ta_romance', icon: Compass },
      { name: 'Entspannung', form: 'ta_relaxe', icon: Compass },
      { name: 'Unterhaltung', form: 'ta_entertain', icon: Compass },
      { name: 'Action', form: 'ta_action', icon: Compass },
      { name: 'Sportlich', form: 'ta_sporty', icon: Compass },
      { name: 'Essen', form: 'ta_food', icon: Compass },
      { name: 'Tiere', form: 'ta_animals', icon: Compass },
    ] },
  { title: { name: 'Elemente', form: 'el', icon: Droplet },
    inputType: 'checkbox',
    data: [
      { name: 'Natur', form: 'el_nature', icon: Compass },
      { name: 'Wasser', form: 'el_water', icon: Compass },
      { name: 'Luft', form: 'el_air', icon: Compass },
    ] },
  { title: { name: 'Draußen/Drinnen', form: 'lo', icon: Home },
    inputType: 'checkbox',
    data: [
      { form: 'lo_indoor', name: 'Drinnen', icon: Compass },
      { form: 'lo_outdoor', name: 'Draußen', icon: Compass },
    ] },
], [
  { title: { name: 'Alter', form: 'ag', icon: UserPlus },
    inputType: 'checkbox',
    data: [
      { name: 'Baby', form: 'ag_baby', icon: Compass },
      { name: 'Kleinkind', form: 'ag_infant', icon: Compass },
      { name: 'Schulkind', form: 'ag_school', icon: Compass },
      { name: 'Teenager', form: 'ag_teen', icon: Compass },
      { name: 'Erwachsen', form: 'ag_adult', icon: Compass },
    ] },
  { title: { name: 'Preis', form: 'pr', icon: DollarSign },
    inputType: 'radio',
    data: [
      { form: 'pr_price_0', name: 'Kostenfrei', icon: Compass },
      { form: 'pr_price_1', name: '0 - 25 €', icon: Compass },
      { form: 'pr_price_2', name: '25 - 50 €', icon: Compass },
      { form: 'pr_price_3', name: '50 - 75 €', icon: Compass },
      { form: 'pr_price_4', name: '75 - 100 €', icon: Compass },
      { form: 'pr_price_5', name: 'Über 100 €', icon: Compass },
    ] },
  { title: { name: 'Personen', form: 'pe', icon: UserPlus },
    inputType: 'radio',
    data: [
      { form: 'pe_eine_pers', name: '1 Pers.', icon: Compass },
      { form: 'pe_zwei_pers', name: '2 Pers.', icon: Compass },
      { form: 'pe_drei_per', name: '3 Pers.', icon: Compass },
      { form: 'pe_vier_pers', name: '4 Pers.', icon: Compass },
      { form: 'pe_fuenf_pers', name: '5 Pers.', icon: Compass },
      { form: 'pe_ueberfuenf_pers', name: 'Über 5 Pers.', icon: Compass },
    ] },
  { title: { name: 'Dauer', form: 'du', icon: Clock },
    inputType: 'radio',
    data: [
      { form: 'du_halbestunde', name: '30 Min.', icon: Compass },
      { form: 'du_stunde', name: '1 Std.', icon: Compass },
      { form: 'du_zweistunden', name: '2 Std.', icon: Compass },
      { form: 'du_dreistunden', name: '3 Std.', icon: Compass },
      { form: 'du_vierstunden', name: '4 Std.', icon: Compass },
      { form: 'du_more', name: 'Über 4 Std.', icon: Compass },
    ] },
]];

export default catFilter;
