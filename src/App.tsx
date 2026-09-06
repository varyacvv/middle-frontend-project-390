import BookingPage from './BookingPage';
import SearchPage from './SearchPage';
import ViewBooking from './ViewBooking';

function App() {
  const path = window.location.pathname;

  if (path.startsWith('/booking/')) {
    const flightId = path.split('/')[2] ?? '';
    return <BookingPage flightId={flightId} />;
  }

  if (path === '/viewbooking') {
    return <ViewBooking />;
  }

  return <SearchPage />;
}

export default App;