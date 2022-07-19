export interface Weather {
    lastUpdated?: string;
    temp: number,
    shortName: 'Thunderstorm' | 'Drizzle' | 'Rain' | 'Snow' | 'Mist' | 'Smoke' | 'Haze' | 'Fog' | 'Sand' | 'Dust' | 'Ash' | 'Squall' | 'Tornado' | 'Clear' | 'Clouds',
    description?: string,
}

export interface Location {
    lat: number,
    lng: number,
    city?: string,
    geoHash: string,
}

export interface User {
    uid?: string;

    displayName?: string;
    email?: string;
    day?: string;
    location?: Location;
    interests?: string[];
    weather?: Weather;
}
