import { useEffect, useState, useCallback, useRef } from 'react';
import { fetchCities, searchFlights } from './api';
import type { City, Flight } from './types';

function App() {
  const [cities, setCities] = useState<City[]>([]);
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [date, setDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState<number>(1);

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const autoSearchTriggered = useRef(false);

  const performSearch = useCallback(
    async (originValue: string, destinationValue: string, dateValue: string, passengersValue: number) => {
      setLoading(true);
      setError(null);
      try {
        const results = await searchFlights({
          origin: originValue,
          destination: destinationValue,
          date: dateValue,
          passengers: passengersValue,
        });
        setFlights(results);
      } catch (e) {
        setFlights([]);
        setError(e instanceof Error ? e.message : 'Ошибка поиска рейсов');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Загружаем города при монтировании
  useEffect(() => {
    const loadCities = async () => {
      try {
        const data = await fetchCities();
        setCities(data);
        if (data.length >= 2) {
          setOrigin(data[0].code);
          setDestination(data[1].code);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка загрузки городов');
      }
    };

    loadCities();
  }, []);

  // Автоматический поиск
  useEffect(() => {
    if (origin && destination && !autoSearchTriggered.current) {
      autoSearchTriggered.current = true;
      performSearch(origin, destination, date, passengers);
    }
  }, [origin, destination, date, passengers, performSearch]);

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(origin, destination, date, passengers);
  };

  return (
    <main className="container py-4">
      <h1>Поиск рейсов</h1>

      <form data-testid="flight-search-form" onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <label htmlFor="origin" className="form-label">Город вылета</label>
            <select
              id="origin"
              data-testid="search-origin"
              className="form-select"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
            >
              <option value="">Выберите город</option>
              {cities.map((city) => (
                <option key={city.code} value={city.code}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label htmlFor="destination" className="form-label">Город прилёта</label>
            <select
              id="destination"
              data-testid="search-destination"
              className="form-select"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            >
              <option value="">Выберите город</option>
              {cities.map((city) => (
                <option key={city.code} value={city.code}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label htmlFor="date" className="form-label">Дата</label>
            <input
              id="date"
              type="date"
              data-testid="search-date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="col-md-2">
            <label htmlFor="passengers" className="form-label">Пассажиры</label>
            <input
              id="passengers"
              type="number"
              min="1"
              data-testid="search-passengers"
              className="form-control"
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              required
            />
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button type="submit" data-testid="search-submit" className="btn btn-primary w-100">
              Найти
            </button>
          </div>
        </div>
      </form>

      {loading && (
        <div className="text-muted" data-testid="flights-loading">
          Загрузка рейсов...
        </div>
      )}

      {error && (
        <div className="alert alert-danger" data-testid="flights-error">
          {error}
        </div>
      )}

      {!loading && !error && flights.length === 0 && (
        <div data-testid="flights-empty">
          Рейсов не найдено. Попробуйте изменить параметры поиска.
        </div>
      )}

      {!loading && !error && flights.length > 0 && (
        <div data-testid="flight-results" className="list-group">
          {flights.map((flight) => (
            <div key={flight.id} className="list-group-item" data-testid="flight-result-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">
                    {flight.airline.name} {flight.flightNumber}
                  </h5>
                  <p className="mb-1">
                    {flight.origin.name} ({flight.origin.code}) → {flight.destination.name} ({flight.destination.code})
                  </p>
                  <small>
                    Вылет: {new Date(flight.departureAt).toLocaleString('ru-RU')} · Прилёт: {new Date(flight.arrivalAt).toLocaleString('ru-RU')} · Длительность: {flight.durationMinutes} мин.
                  </small>
                </div>
                <div className="text-end">
                  <div className="fs-4 fw-bold">
                    {flight.price.amount} {flight.price.currency}
                  </div>
                  <a href={`/booking/${flight.id}`} data-testid="book-flight" className="btn btn-success mt-2">
                    Забронировать
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default App;