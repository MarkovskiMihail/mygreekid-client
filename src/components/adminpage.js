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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f6fa',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '30px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          borderBottom: '2px solid #f0f2f5',
          paddingBottom: '20px'
        }}>
          <h2 style={{
            fontSize: '28px',
            color: '#2d3436',
            margin: 0,
            fontWeight: '600'
          }}>Admin Dashboard</h2>

          <div style={{
            display: 'flex',
            gap: '15px'
          }}>
            <button
              onClick={() => navigate('/createSlots')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#4834d4',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#3c2ab3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#4834d4'}
            >
              Create Slots
            </button>

            <button
              onClick={handleLogout}
              style={{
                padding: '12px 24px',
                backgroundColor: '#ff4757',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#ff6b81'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ff4757'}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Admin Registration Form */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '40px'
        }}>
          <h3 style={{
            fontSize: '20px',
            color: '#2d3436',
            marginBottom: '20px',
            fontWeight: '600'
          }}>Register New Admin</h3>

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

          <form onSubmit={handleSubmit}>
            {/* Form inputs with consistent styling */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#4a5568',
                fontSize: '14px',
                fontWeight: '500'
              }}>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#4a5568',
                fontSize: '14px',
                fontWeight: '500'
              }}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#4a5568',
                fontSize: '14px',
                fontWeight: '500'
              }}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#4a5568',
                fontSize: '14px',
                fontWeight: '500'
              }}>Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
              >
                <option value="">-- Select Department --</option>
                <option value="Athens_Police_Department">Athens Police Department</option>
                <option value="Thessaloniki_Police_Department">Thessaloniki Police Department</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#4a5568',
                fontSize: '14px',
                fontWeight: '500'
              }}>Location</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
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
                padding: '12px',
                backgroundColor: '#4834d4',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'background-color 0.3s ease',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Registering...' : 'Register Admin'}
            </button>
          </form>
        </div>

        {/* Bookings List */}
        <div>
          <h3 style={{
            fontSize: '20px',
            color: '#2d3436',
            marginBottom: '20px',
            fontWeight: '600'
          }}>All Bookings</h3>

          {bookings.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <p style={{ margin: '8px 0', fontSize: '14px' }}><strong>Date:</strong> {booking.slot.date}</p>
                  <p style={{ margin: '8px 0', fontSize: '14px' }}><strong>Time:</strong> {booking.slot.startTime} - {booking.slot.endTime}</p>
                  <p style={{ margin: '8px 0', fontSize: '14px' }}><strong>Room:</strong> {booking.slot.roomNumber}</p>
                  <p style={{ margin: '8px 0', fontSize: '14px' }}><strong>Registrar:</strong> {booking.slot.registrarName}</p>
                  <p style={{ margin: '8px 0', fontSize: '14px' }}><strong>Location:</strong> {booking.slot.departmentLocation}</p>
                  <p style={{ margin: '8px 0', fontSize: '14px' }}><strong>Department:</strong> {booking.slot.departmentName}</p>
                  
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    style={{
                      width: '100%',
                      padding: '10px',
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
                    onMouseOver={(e) => e.target.style.backgroundColor = '#ff6b81'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#ff4757'}
                  >
                    Cancel Booking
                  </button>
                </div>
              ))}
            </div>
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
      </div>
    </div>
  );
};

export default AdminPage;