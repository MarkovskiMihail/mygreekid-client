import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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
                role: "ADMIN", // Add the role header
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
        }
      };
      

    fetchBookings();
  }, [token, user.userId]);

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', textAlign: 'center' }}>
      <h2>My Bookings</h2>
      {loading && <p>Loading your bookings...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

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
