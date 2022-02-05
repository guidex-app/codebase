import { geohashForLocation } from 'geofire-common';

import { Location } from '../interfaces/user';

const formatPos = async (lat: number, lng: number): Promise<Location> => {
  const geoHash: string = geohashForLocation([lat, lng], 4);

  return {
    lat,
    lng,
    geoHash,
    date: new Date().getTime(),
  };
};

const getPosition = () => {
  const options = { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 };
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

const getGeoLocation = async (): Promise<Location> => (
  getPosition().then((pos: any) => {
    console.log(pos);
    return formatPos(pos.coords.latitude, pos.coords.longitude);
  }).catch(() => (
    {
      lat: 53.5510846,
      lng: 9.9936818,
      city: 'Hamburg',
      geoHash: 'u1x0',
      date: new Date().getTime(),
    }
  ))
);

export default getGeoLocation;
