type Images = 'thumbnail' | 'image1' | 'image2' | 'image3' | 'image4';
type IsComplete = 'service' | 'available' | 'prices';

export interface ActBasic {
  title: { name: string, form: string },
  category: { name: string, form: string },
  reservationActive?: boolean;
  member?: string[];
  description: string;
  rating?: [number, number, number, number, number];
  state?: (IsComplete | Images)[]
  online: boolean;
  language?: string[];
  filter: ('Indoor' | 'Outdoor')[]
}

export interface CompLocation {
  geohash: string;
  geopoint: number[];
  neighbors: string[];
}

export interface Address extends CompLocation {
  houseNumber?: number,
  place: string,
  street: string,
  plz: number,
}

export interface ActContact {
  emptyGuidexContact?: boolean,
  emptyCustomerContact?: boolean,
  emptyHouseNumber?: boolean,

  guidexContact?: {
    name?: string,
    phone?: string,
  },
  customerContact?: {
    website?: string,
    phone?: string,
  },

  address?: Address;
}

export interface ActOpenings {
  saisonalOpenings?: string[],
  holidayOpenings?: string[],
  openings: (string | false)[],
}

export interface Activity extends ActBasic, ActContact, ActOpenings {}
