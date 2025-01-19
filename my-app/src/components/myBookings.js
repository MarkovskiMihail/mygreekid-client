import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('jwtToken'); // Retrieve the token from localStorage
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve user info from localStorage

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          'https://mygreekid-gateway-3fca46750ff3.herokuapp.com/api/bookings',
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the JWT token
              role: user.role, // Add the role header
            },
          }
        );

        // Filter bookings for the logged-in user
        const userBookings = response.data.filter(
          (booking) => booking.user.userId === user.userId
        );
        setBookings(userBookings);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token, user.userId]);

  const handleCancelBooking = async (id) => {
    try {
      await axios.delete(
        `https://mygreekid-gateway-3fca46750ff3.herokuapp.com/api/bookings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Booking cancelled successfully.');
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id));
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking. Please try again later.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', textAlign: 'center' }}>
      <h2>My Bookings</h2>
      {loading && <p>Loading your bookings...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {bookings.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {bookings.map((booking) => (
            <li
              key={booking.id}
              style={{
                marginBottom: '20px',
                padding: '15px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                textAlign: 'left',
              }}
            >
              <p><strong>Date:</strong> {booking.slot.date}</p>
              <p><strong>Time:</strong> {booking.slot.startTime} - {booking.slot.endTime}</p>
              <p><strong>Room:</strong> {booking.slot.roomNumber}</p>
              <p><strong>Registrar:</strong> {booking.slot.registrarName}</p>
              <p><strong>Location:</strong> {booking.slot.departmentLocation}</p>
              <p><strong>Department:</strong> {booking.slot.departmentName}</p>
              <p><strong>Address:</strong> {booking.slot.departmentAddress}</p>
              <p><strong>Appointment Time:</strong> {new Date(booking.appointmentTime).toLocaleString()}</p>
              <button
                onClick={() => handleCancelBooking(booking.id)}
                style={{
                  marginTop: '10px',
                  padding: '5px 10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancel Booking
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No bookings found.</p>
      )}
    </div>
  );
};

export default MyBookingsScreen;
