import { useState } from 'react'; // Import only what is needed
import axios from 'axios';
import './BookingScreen.css';  // Ensure this exists for styling

const BookingScreen = () => {
  const [serviceProviderId, setServiceProviderId] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');

  const handleBooking = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        'http://localhost:8081/api/book',  // Ensure the correct route
        { serviceProviderId, service, date, time },
        { withCredentials: true }
      );
      setMessage(data.message);
    } catch (error) {
      console.error('Error creating booking:', error);
      setMessage('Error creating booking');
    }
  };

  return (
    <div className="booking-container">
      <h1>Book a Service</h1>
      <form onSubmit={handleBooking}>
        <div className="form-group">
          <label htmlFor="serviceProviderId">Service Provider ID:</label>
          <input
            id="serviceProviderId"
            type="text"
            value={serviceProviderId}
            onChange={(e) => setServiceProviderId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="service">Service:</label>
          <input
            id="service"
            type="text"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="time">Time:</label>
          <input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Book Now</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default BookingScreen;
