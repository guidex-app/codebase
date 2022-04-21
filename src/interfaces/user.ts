export interface Weather {
    temp: number,
    date: string,
    shortName: 'Thunderstorm' | 'Drizzle' | 'Rain' | 'Snow' | 'Mist' | 'Smoke' | 'Haze' | 'Fog' | 'Sand' | 'Dust' | 'Ash' | 'Squall' | 'Tornado' | 'Clear' | 'Clouds',
    description: string,
}

export interface Location {
    lat: number,
    lng: number,
    city?: string,
    geoHash: string,
    date: number;
    weather?: Weather;
}

export interface User {
    displayName?: string;
    email?: string;
    location?: Location;
    interests?: string[];
    uid?: string;
}
