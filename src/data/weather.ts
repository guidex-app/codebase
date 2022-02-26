import { Weather } from '../interfaces/user';

const apiKey = 'a99a19c1c0af407eddb2b0c880c8a813';
const getURL = (lat: number, lng: number) => `https://api.openweathermap.org/data/2.5/onecall?appid=${apiKey}&exclude=alerts,hourly,minutely&units=metric&lat=${lat}&lon=${lng}&cnt=3&lang=de`;

// const getWeather = async (day: string, lat: number, lng: number): Promise<WeatherProps> => {
//   try {
//     const getData = await fetch(getURL(lat, lng)).then((response) => response.json());
//     return getData.current && convertData(getData.current);
//   } catch (e) {
//     console.error('Error adding document: ', e);
//   }
// };

const getWeather = async (day: string, lat: number, lng: number): Promise<Weather> => {
  const loadAPI = await fetch(getURL(lat, lng));
  const data = await loadAPI.json();
  console.log('load weather', day);
  return {
    temp: Math.round(data.current.feels_like),
    shortName: data.current.weather[0].main,
    description: data.current.weather[0].description,
  };
};

export default getWeather;
