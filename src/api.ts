import type { City, Flight } from "./types";

export async function fetchCities(): Promise<City[]> {
  const response = await fetch("/api/cities");
  if (!response.ok) {
    throw new Error("Не удалось загрузить города");
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
    throw new Error("Не удалось выполнить поиск рейсов");
  }
  return response.json();
}
