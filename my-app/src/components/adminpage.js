import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    department: '',
    location: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);

  const token = localStorage.getItem('jwtToken'); // Retrieve the token from localStorage
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          'https://mygreekid-gateway-3fca46750ff3.herokuapp.com/api/bookings',
          {
            headers: {
              Authorization: `Bearer ${token}`,            },
          }
        );
        setBookings(response.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to fetch bookings.');
      }
    };

    fetchBookings();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        'https://mygreekid-gateway-3fca46750ff3.herokuapp.com/auth/register/admin',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage('Admin registered successfully!');
      console.log('Response:', response.data);
    } catch (err) {
      console.error('Error registering admin:', err);
      setError(err.response?.data?.message || 'Failed to register admin.');
    } finally {
      setLoading(false);
    }
  };

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
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id));
      setMessage('Booking cancelled successfully.');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Admin Registration</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="department">Department</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px' }}
          >
            <option value="">-- Select Department --</option>
            <option value="Athens_Police_Department">Athens Police Department</option>
            <option value="Thessaloniki_Police_Department">Thessaloniki Police Department</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="location">Location</label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px' }}
          >
            <option value="">-- Select Location --</option>
            <option value="ATHENS">Athens</option>
            <option value="THESSALONIKI">Thessaloniki</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Registering Admin...' : 'Register Admin'}
        </button>
      </form>

      <button
        onClick={handleLogout}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>

      <div style={{ marginTop: '50px' }}>
        <h3>All Bookings</h3>
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
          <p>No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
