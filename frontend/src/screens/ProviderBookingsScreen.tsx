import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProviderBookingsScreen.css';  // Create styling if necessary

const ProviderBookingsScreen = () => {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get('http://localhost:8081/api/bookings/provider', { withCredentials: true });
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="booking-list">
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} className="booking-item">
            <p>Service: {booking.service}</p>
            <p>Date: {booking.date}</p>
            <p>Time: {booking.time}</p>
            <p>Consumer: {booking.consumer.firstName} {booking.consumer.lastName}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ProviderBookingsScreen;
