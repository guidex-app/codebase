export interface Location {
    lat: number,
    lng: number,
    city?: string,
    geoHash: string,
    date: number;
}

export interface Weather {
    temp: number,
    shortName: 'Thunderstorm' | 'Drizzle' | 'Rain' | 'Snow' | 'Mist' | 'Smoke' | 'Haze' | 'Dust' | 'Fog' | 'Sand' | 'Dust' | 'Ash' | 'Squall' | 'Tornado' | 'Clear' | 'Clouds',
    description: string,
    date: number,
}

export interface User {
    displayName?: string;
    email?: string;
    weather?: Weather;
    location?: Location;
    interests?: string[];
    uid?: string;
}
