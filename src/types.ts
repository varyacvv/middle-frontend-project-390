export interface City {
  code: string;
  name: string;
  country?: string;
}

export interface Airline {
  code: string;
  name: string;
}

export interface Money {
  amount: number;
  currency: string;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: Airline;
  origin: City;
  destination: City;
  departureAt: string;
  arrivalAt: string;
  durationMinutes: number;
  price: Money;
  seatsAvailable: number;
}

export interface Passenger {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  documentNumber: string;
}

export interface Contact {
  email: string;
  phone: string;
}

export interface Booking {
  code: string;
  status: 'confirmed' | 'cancelled';
  flight: Flight;
  passengers: Passenger[];
  contact: Contact;
  totalPrice: Money;
  createdAt: string;
}

export interface CreateBookingRequest {
  flightId: string;
  contact: Contact;
  passengers: Passenger[];
}