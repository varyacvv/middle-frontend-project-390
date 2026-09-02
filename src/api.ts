import type { City, Flight, CreateBookingRequest, Booking } from './types';

export async function fetchCities(): Promise<City[]> {
  const response = await fetch('/api/cities');
  if (!response.ok) {
    throw new Error('Не удалось загрузить города');
  }
  return response.json();
}

export async function searchFlights(params: {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
}): Promise<Flight[]> {
  const searchParams = new URLSearchParams({
    origin: params.origin,
    destination: params.destination,
    date: params.date,
    passengers: String(params.passengers),
  });

  const response = await fetch(`/api/flights?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error('Не удалось выполнить поиск рейсов');
  }
  return response.json();
}

export async function fetchFlightById(id: string): Promise<Flight | null> {
  const response = await fetch(`/api/flights/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Не удалось загрузить рейс');
  }
  return response.json();
}

export async function createBooking(data: CreateBookingRequest): Promise<Booking> {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Не удалось создать бронь');
  }
  return response.json();
}