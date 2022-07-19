/**
 * Preise mit ihren Bedingungen, zur Ausgabe
 */
export interface PriceItem {
    id?: string;
    price?: number;

    duration: number;

    day: string;
    discount: string | false; // age & normale rabatte
    time: string | false;

    // rabatte
    persons: string;
    roundDiscount: string | false;
  }

/**
   * Preise mit ihren Bedingungen, zur Ausgabe
   */
export interface Capacity {
    availableID: string;
    time: string;
    date: string;
    value: number;
  }

export interface ContainsList {
    discount: string[]; // age und normale rabatte
    roundDiscount: string[];
    time: string[];
    persons: string[];
  }

// export interface ReserveItem {
//   ID: { activityID: string, serviceID: string };
//   description?: string;
//   title?: string;
//   durationAndGames?: { type?: 'rounds'|'duration', list: string[], roundDuration?: number };
//   serviceType: 'entry'|'section'|'object';
//   questionsCompleted?: boolean;
// }

export interface Available {
    defaultCapacity: number;
    countMaxRoomPerson: number;
    countMinPerson: number;
    minPerson?: number;
    leadTimeInMin: number;
  }

/**
   * amountReserved: Bei Räumen gibt es die schon reservierten Räume zurück und bei Eintritt die schon reservierten Personen.
   */
export interface ReservationSlot {
  date: string;
  startTime: string;
  personAmount: any;
  rooms?: number;
  }

export interface ReservationStatus {
    state: 'active' | 'isCanceled' | 'userCanceled';
    dateCreated: Date;
    dateUpdated?: Date;

    emailSend: boolean;
    emailReceived: boolean;
  }

export interface Reservation {
    reservationId: string;
    uid: string;

    date: [Date, Date]; // von datum, bis datum

    startTime: string;

    personAmount: number;
    rooms?: number;
    rounds: number;
    duration: number;

    serviceName: string;
    reservationStatus?: ReservationStatus;

    totalPrice: number | string;
  }

export interface ShoppingCart {
    discount?: string, // age und normale rabatte
    price: number,
    amount: number,
    groupDiscount?: number,
    room?: number,
}

export interface UserValues {
    ages?: { [key: string]: number },
    discount?: { [key: string]: number },
  }
