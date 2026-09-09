import { useState } from 'react';
import { fetchBooking, cancelBooking } from './api';
import type { Booking } from './types';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';

function ViewBooking() {
  const [code, setCode] = useState('');
  const [lastName, setLastName] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !lastName.trim()) return;

    setLoading(true);
    setError(null);
    setBooking(null);

    try {
      const data = await fetchBooking(code.trim(), lastName.trim());
      setBooking(data);
    } catch (err) {
      const errorStatus = (err as { status?: number }).status;
      if (errorStatus === 404) {
        setError('Бронь не найдена');
      } else {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки брони');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!booking) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await cancelBooking(booking.code, lastName.trim());
      setBooking(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отмены брони');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container py-4">
      <h1>Мои брони</h1>

      <form data-testid="booking-lookup-form" onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label htmlFor="lookup-code" className="form-label">Код брони</label>
            <input
              id="lookup-code"
              data-testid="lookup-code"
              className="form-control"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="lookup-lastName" className="form-label">Фамилия</label>
            <input
              id="lookup-lastName"
              data-testid="lookup-lastName"
              className="form-control"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <button type="submit" data-testid="lookup-submit" className="btn btn-primary w-100">
              Найти
            </button>
          </div>
        </div>
      </form>

      {loading && <Loading text="Загрузка..." />}

      {error && <ErrorMessage message={error} testId="booking-not-found" />}

      {booking && (
        <div data-testid="booking-details" className="border p-4 rounded">
          <h2>Информация о брони</h2>
          <p>
            Код: <strong data-testid="booking-code">{booking.code}</strong>
          </p>
          <p>
            Статус:{' '}
            <span
              data-testid="booking-status"
              data-status={booking.status}
              className={booking.status === 'confirmed' ? 'text-success' : 'text-warning'}
            >
              {booking.status === 'confirmed' ? 'Подтверждена' : 'Отменена'}
            </span>
          </p>
          <hr />
          <h3>Рейс</h3>
          <p>
            {booking.flight.airline.name} {booking.flight.flightNumber}
          </p>
          <p>
            {booking.flight.origin.name} ({booking.flight.origin.code}) →{' '}
            {booking.flight.destination.name} ({booking.flight.destination.code})
          </p>
          <p>
            Вылет: {new Date(booking.flight.departureAt).toLocaleString('ru-RU')} · Прилёт:{' '}
            {new Date(booking.flight.arrivalAt).toLocaleString('ru-RU')}
          </p>
          <p>Итоговая стоимость: {booking.totalPrice.amount} {booking.totalPrice.currency}</p>

          <hr />
          <h3>Пассажиры</h3>
          {booking.passengers.map((passenger, index) => (
            <div key={index} className="mb-2">
              {passenger.firstName} {passenger.lastName} (дата рождения: {passenger.dateOfBirth})
            </div>
          ))}

          <hr />
          <p>
            Контакт: {booking.contact.email}, {booking.contact.phone}
          </p>

          {booking.status === 'confirmed' && (
            <button
              type="button"
              data-testid="cancel-booking"
              className="btn btn-danger"
              onClick={handleCancel}
            >
              Отменить бронь
            </button>
          )}
        </div>
      )}
    </main>
  );
}

export default ViewBooking;