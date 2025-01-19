import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FreeSlotsScreen = () => {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('jwtToken');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get(
          'https://mygreekid-gateway-3fca46750ff3.herokuapp.com/api/slots',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const availableSlots = response.data.filter(slot => !slot.booked);
        setSlots(availableSlots);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch slots. Please try again later.');
      }
    };

    fetchSlots();
  }, [token]);

  const handleDateChange = (e) => {
    const selected = e.target.value;
    setSelectedDate(selected);
    const filtered = slots.filter((slot) => slot.date === selected);
    setFilteredSlots(filtered);
  };

  const handleReserveSlot = async (slot) => {
    try {
      // First check if user already has a booking
      const response = await axios.get(
        'https://mygreekid-gateway-3fca46750ff3.herokuapp.com/api/bookings',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'role': 'ROLE_USER'
          }
        }
      );

      if (response.data && response.data.length > 0) {
        setError('You already have an active booking. Please cancel your existing booking before making a new one.');
        return;
      }

      // If no existing booking, proceed with reservation
      const booking = {
        user: {
          userId: user.userId,
          username: user.username,
          role: user.role,
        },
        slot: {
          slotId: slot.slotId,
        },
        appointmentTime: `${slot.date}T${slot.startTime}`,
      };

      await axios.post(
        'https://mygreekid-gateway-3fca46750ff3.herokuapp.com/api/bookings',
        booking,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      setMessage('Slot reserved successfully!');
      const updatedSlots = slots.filter(s => s.slotId !== slot.slotId);
      setSlots(updatedSlots);
      setFilteredSlots(prev => prev.filter(s => s.slotId !== slot.slotId));
    } catch (err) {
      console.error('Error reserving slot:', err);
      setError(err.response?.data?.message || 'Failed to reserve the slot. Please try again later.');
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
      backgroundColor: '#f8f9fa',
      padding: '40px 20px'
    }}>
      <div style={{ 
        maxWidth: '1000px', 
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px'
        }}>
          <h2 style={{
            color: '#2d3436',
            fontSize: '28px',
            fontWeight: '600',
            margin: 0
          }}>Available Appointments</h2>

          <div style={{
            display: 'flex',
            gap: '15px'
          }}>
            <button
              onClick={() => navigate('/myBookings')}
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
              My Bookings
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

        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            marginBottom: '30px'
          }}>
            <label 
              htmlFor="date" 
              style={{
                display: 'block',
                marginBottom: '10px',
                color: '#4a5568',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Select Appointment Date
            </label>
            <select
              id="date"
              value={selectedDate}
              onChange={handleDateChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                color: '#4a5568',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4834d4'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            >
              <option value="">-- Select a Date --</option>
              {[...new Set(slots.map((slot) => slot.date))].map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>

          {selectedDate && (
            <div>
              <h3 style={{
                fontSize: '20px',
                color: '#2d3436',
                marginBottom: '20px',
                fontWeight: '600'
              }}>
                Available Slots for {selectedDate}
              </h3>
              
              {filteredSlots.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '20px'
                }}>
                  {filteredSlots.map((slot) => (
                    <div
                      key={slot.slotId}
                      style={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        padding: '20px',
                        border: '1px solid #e2e8f0',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ marginBottom: '15px' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                          <strong>Time:</strong> {slot.startTime} - {slot.endTime}
                        </p>
                        <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                          <strong>Room:</strong> {slot.roomNumber}
                        </p>
                        <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                          <strong>Registrar:</strong> {slot.registrarName}
                        </p>
                        <p style={{ margin: '0', fontSize: '14px' }}>
                          <strong>Location:</strong> {slot.departmentLocation}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleReserveSlot(slot)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          backgroundColor: '#4834d4',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#3c2ab3'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#4834d4'}
                      >
                        Reserve Slot
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '30px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  color: '#718096'
                }}>
                  No available slots for this date.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreeSlotsScreen;