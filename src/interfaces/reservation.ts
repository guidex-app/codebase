/**
 * Preise mit ihren Bedingungen, zur Ausgabe
 */
export interface PriceItem {
    id?: string;
    price?: number;

    duration: number;
    persons: number;

    day: string;
    rounds?: number | false;
    discount: string | false;
    age: string | false;
    time: string | false;
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
    day: string[];
    age: string[];
    discount: string[];
    time: string[];
    persons: number[];
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
export interface Reserved {
    date: string;
    time: string;
    amountReserved: number;
  }

export interface ReservationStatus {
    dateCreated: Date;
    dateUpdated?: string;

    emailSend: boolean;
    emailReceived: boolean;
  }

export interface Reservation {
    reservationId: string;
    userId: string;

    startDate: string;
    endDate: string;

    startTime: number;

    personAmount: number;
    rooms?: number;

    serviceName: string;
    reservationStatus?: ReservationStatus;

    totalPrice: number | string;
  }

export interface ShoppingCart {
    age: string,
    discount?: string,
    price: number,
    amount: number,
    groupDiscount?: number,
    room?: number,
  }

export interface UserValues {
    ages?: { [key: string]: number },
    discountName?: { [key: string]: number },
    onDuration?: string;
  }
