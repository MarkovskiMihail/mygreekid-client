import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('jwtToken');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        'https://mygreekid-gateway-3fca46750ff3.herokuapp.com/api/bookings',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'role': 'ROLE_USER'
          }
        }
      );
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch bookings');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [token, user, navigate]);

  const handleDeleteBooking = async (bookingId, slot) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      console.log('Attempting to delete booking:', bookingId);
      console.log('Slot data:', slot);

      // First delete the booking
      await axios.delete(
        `https://mygreekid-gateway-3fca46750ff3.herokuapp.com/api/bookings/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Get admin token before updating slot
      const adminLoginResponse = await axios.post(
        'https://mygreekid-gateway-3fca46750ff3.herokuapp.com/auth/login',
        {
          username: "admin_gorjan",
          password: "admin123"
        }
      );

      const adminToken = adminLoginResponse.data.token;

      // Then update the slot's status while preserving all other data
      await axios.put(
        `https://mygreekid-gateway-3fca46750ff3.herokuapp.com/api/slots/${slot.slotId}`,
        {
          slotId: slot.slotId,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          roomNumber: slot.roomNumber,
          registrarName: slot.registrarName,
          departmentLocation: slot.departmentLocation,
          departmentName: slot.departmentName,
          departmentAddress: slot.departmentAddress,
          booked: false
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage('Booking cancelled successfully.');
      fetchBookings();  // Refresh the bookings list
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking. Please try again later.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '0 20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          color: '#2d3436',
          fontSize: '28px',
          margin: 0
        }}>My Bookings</h2>

        <button
          onClick={() => navigate('/calendarpage')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4834d4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3c2ab3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4834d4'}
        >
          Back to Calendar
        </button>
      </div>

      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#ffe3e3',
          color: '#ff4757',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {message && (
        <div style={{
          padding: '12px',
          backgroundColor: '#e3ffe3',
          color: '#28a745',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#636e72' }}>Loading your bookings...</p>
      ) : (
        <div>
          {bookings.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {bookings.map((booking) => (
                <li
                  key={booking.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e1e8ed'
                  }}
                >
                  <p style={{ margin: '8px 0' }}><strong>Date:</strong> {booking.slot.date}</p>
                  <p style={{ margin: '8px 0' }}><strong>Time:</strong> {booking.slot.startTime} - {booking.slot.endTime}</p>
                  <p style={{ margin: '8px 0' }}><strong>Room:</strong> {booking.slot.roomNumber}</p>
                  <p style={{ margin: '8px 0' }}><strong>Registrar:</strong> {booking.slot.registrarName}</p>
                  <p style={{ margin: '8px 0' }}><strong>Location:</strong> {booking.slot.departmentLocation}</p>
                  <p style={{ margin: '8px 0' }}><strong>Department:</strong> {booking.slot.departmentName}</p>
                  <p style={{ margin: '8px 0' }}><strong>Address:</strong> {booking.slot.departmentAddress}</p>
                  
                  <button
                    onClick={() => {
                      console.log('Booking data:', booking);  // Debug log
                      handleDeleteBooking(booking.id, booking.slot);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#ff4757',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginTop: '15px',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ff6b81'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff4757'}
                  >
                    Cancel Booking
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              color: '#636e72'
            }}>
              No bookings found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookingsScreen;