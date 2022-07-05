import { geohashForLocation } from 'geofire-common';

import { Location } from '../interfaces/user';

const formatPos = async (lat: number, lng: number): Promise<Location> => {
  const geoHash: string = geohashForLocation([lat, lng], 4);

  return {
    lat,
    lng,
    city: 'test',
    geoHash,
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
  })
);

export default getGeoLocation;
