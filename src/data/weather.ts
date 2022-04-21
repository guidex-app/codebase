import { generateDateString } from '../helper/date';
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

const getWeather = async (lat: number, lng: number): Promise<Weather[]> => {
  const loadAPI = await fetch(getURL(lat, lng));
  const data = await loadAPI.json();

  console.log(data);
  const current = {
    temp: Math.round(data.current.feels_like),
    shortName: data.current.weather[0].main,
    date: generateDateString(new Date(data.current.dt * 1000)),
    description: data.current.weather[0].description,
  };

  const nextDays = [1, 2, 3, 4, 5].map((dayNr: number) => ({
    temp: Math.round(data.daily[dayNr].feels_like.day),
    date: generateDateString(new Date(data.daily[dayNr].dt * 1000)),
    shortName: data.daily[dayNr].weather[0].main,
    description: data.daily[dayNr].weather[0].description,
  }));

  return [current, ...nextDays];
};

export default getWeather;
