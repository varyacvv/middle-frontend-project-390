import { useEffect, useState } from 'react';
import { fetchFlightById, createBooking } from './api';
import type { Flight, Passenger, Booking } from './types';

interface BookingPageProps {
    flightId: string;
}

function BookingPage({ flightId }: BookingPageProps) {
    const [flight, setFlight] = useState<Flight | null>(null);
    const [loadingFlight, setLoadingFlight] = useState<boolean>(true);
    const [flightError, setFlightError] = useState<string | null>(null);

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [passengers, setPassengers] = useState<Passenger[]>([
        { firstName: '', lastName: '', dateOfBirth: '', documentNumber: '' },
    ]);

    const [submitting, setSubmitting] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [booking, setBooking] = useState<Booking | null>(null);

    useEffect(() => {
        const loadFlight = async () => {
            setLoadingFlight(true);
            setFlightError(null);
            try {
                const data = await fetchFlightById(flightId);
                if (data === null) {
                    setFlight(null);
                    setFlightError('Рейс не найден');
                } else {
                    setFlight(data);
                }
            } catch (e) {
                setFlight(null);
                setFlightError(e instanceof Error ? e.message : 'Ошибка загрузки рейса');
            } finally {
                setLoadingFlight(false);
            }
        };
        loadFlight();
    }, [flightId]);

    const addPassenger = () => {
        setPassengers((prev) => [
            ...prev,
            { firstName: '', lastName: '', dateOfBirth: '', documentNumber: '' },
        ]);
    };

    const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
        setPassengers((prev) =>
            prev.map((passenger, i) => (i === index ? { ...passenger, [field]: value } : passenger))
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !phone) {
            setBookingError('Заполните email и телефон');
            return;
        }
        for (let i = 0; i < passengers.length; i += 1) {
            const p = passengers[i];
            if (!p.firstName || !p.lastName || !p.dateOfBirth || !p.documentNumber) {
                setBookingError(`Заполните все поля пассажира ${i + 1}`);
                return;
            }
        }

        setSubmitting(true);
        setBookingError(null);

        try {
            const created = await createBooking({
                flightId,
                contact: { email, phone },
                passengers,
            });
            setBooking(created);
        } catch (e) {
            setBookingError(e instanceof Error ? e.message : 'Ошибка бронирования');
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingFlight) {
        return <div>Загрузка рейса...</div>;
    }

    if (flightError && !flight) {
        return <div data-testid="flight-not-found">Рейс не найден</div>;
    }

    if (booking) {
        return (
            <div data-testid="booking-success" className="container py-4">
                <h2>Бронь подтверждена</h2>
                <p>
                    Код брони: <strong data-testid="booking-code">{booking.code}</strong>
                </p>
            </div>
        );
    }

    if (!flight) {
        return null;
    }

    return (
        <main className="container py-4">
            <h1>Оформление бронирования</h1>

            <div data-testid="booking-flight" className="mb-4 p-3 border rounded">
                <h5>{flight.airline.name} {flight.flightNumber}</h5>
                <p className="mb-1">
                    {flight.origin.name} ({flight.origin.code}) → {flight.destination.name} ({flight.destination.code})
                </p>
                <small>
                    Вылет: {new Date(flight.departureAt).toLocaleString('ru-RU')} · Прилёт: {new Date(flight.arrivalAt).toLocaleString('ru-RU')}
                </small>
                <div className="mt-2">
                    Цена за пассажира: {flight.price.amount} {flight.price.currency}
                </div>
            </div>

            <form data-testid="booking-form" onSubmit={handleSubmit}>
                <h3>Контакт</h3>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            data-testid="contact-email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="phone" className="form-label">Телефон</label>
                        <input
                            type="tel"
                            id="phone"
                            data-testid="contact-phone"
                            className="form-control"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <h3>Пассажиры</h3>
                {passengers.map((passenger, index) => (
                    <div key={index} className="border p-3 mb-3 rounded">
                        <h5>Пассажир {index + 1}</h5>
                        <div className="row">
                            <div className="col-md-3">
                                <label htmlFor={`firstName-${index}`} className="form-label">Имя</label>
                                <input
                                    id={`firstName-${index}`}
                                    data-testid={`passenger-${index}-firstName`}
                                    className="form-control"
                                    value={passenger.firstName}
                                    onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor={`lastName-${index}`} className="form-label">Фамилия</label>
                                <input
                                    id={`lastName-${index}`}
                                    data-testid={`passenger-${index}-lastName`}
                                    className="form-control"
                                    value={passenger.lastName}
                                    onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor={`dob-${index}`} className="form-label">Дата рождения</label>
                                <input
                                    type="date"
                                    id={`dob-${index}`}
                                    data-testid={`passenger-${index}-dob`}
                                    className="form-control"
                                    value={passenger.dateOfBirth}
                                    onChange={(e) => updatePassenger(index, 'dateOfBirth', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor={`document-${index}`} className="form-label">Документ</label>
                                <input
                                    id={`document-${index}`}
                                    data-testid={`passenger-${index}-document`}
                                    className="form-control"
                                    value={passenger.documentNumber}
                                    onChange={(e) => updatePassenger(index, 'documentNumber', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button type="button" className="btn btn-outline-primary mb-3" data-testid="add-passenger" onClick={addPassenger}>
                    Добавить пассажира
                </button>

                {bookingError && (
                    <div data-testid="booking-error" className="alert alert-danger">
                        {bookingError}
                    </div>
                )}

                <div>
                    <button type="submit" data-testid="booking-submit" className="btn btn-success" disabled={submitting}>
                        {submitting ? 'Отправка...' : 'Забронировать'}
                    </button>
                </div>
            </form>
        </main>
    );
}

export default BookingPage;