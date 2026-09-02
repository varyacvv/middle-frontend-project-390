import BookingPage from './BookingPage';
import SearchPage from './SearchPage';

function App() {
  const path = window.location.pathname;

  if (path.startsWith('/booking/')) {
    const flightId = path.split('/')[2] ?? '';
    return <BookingPage flightId={flightId} />;
  }

  return <SearchPage />;
}

export default App;