import apiClient from "./apiClient";
import type { City, Flight, CreateBookingRequest, Booking } from "./types";

export async function fetchCities(): Promise<City[]> {
  const response = await apiClient.get<City[]>("/cities");
  return response.data;
}

export async function searchFlights(params: {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
}): Promise<Flight[]> {
  const response = await apiClient.get<Flight[]>("/flights", {
    params: {
      origin: params.origin,
      destination: params.destination,
      date: params.date,
      passengers: params.passengers,
    },
  });
  return response.data;
}

export async function fetchFlightById(id: string): Promise<Flight | null> {
  try {
    const response = await apiClient.get<Flight>(`/flights/${id}`);
    return response.data;
  } catch (error) {
    if (
      error instanceof Error &&
      (error as { status?: number }).status === 404
    ) {
      return null;
    }
    throw error;
  }
}

export async function createBooking(
  data: CreateBookingRequest,
): Promise<Booking> {
  const response = await apiClient.post<Booking>("/bookings", data);
  return response.data;
}

export async function fetchBooking(
  code: string,
  lastName: string,
): Promise<Booking> {
  const response = await apiClient.get<Booking>(`/bookings/${code}`, {
    params: { lastName },
  });
  return response.data;
}

export async function cancelBooking(
  code: string,
  lastName: string,
): Promise<Booking> {
  const response = await apiClient.post<Booking>(`/bookings/${code}/cancel`, {
    lastName,
  });
  return response.data;
}
