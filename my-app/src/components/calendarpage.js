import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FreeSlotsScreen = () => {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('jwtToken'); // Retrieve the token from localStorage or any other storage
  const user = JSON.parse(localStorage.getItem('user')); // Assuming user info is stored in localStorage
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get(
          'https://appointments-server-1-8e83aec0397d.herokuapp.com/api/slots',
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the JWT token
            },
          }
        );
        // Filter out slots where booked is true and match user department with slot location
        const availableSlots = response.data.filter(
          (slot) =>
            !slot.booked &&
            ((slot.departmentLocation === 'Thessaloniki' && user.department === 'Thessaloniki_Police_Department') ||
              (slot.departmentLocation === 'Athens' && user.department === 'Athens_Police_Department'))
        );
        setSlots(availableSlots);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch slots. Please try again later.');
      }
    };

    fetchSlots();
  }, [token, user.department]);

  const handleDateChange = (e) => {
    const selected = e.target.value;
    setSelectedDate(selected);

    const filtered = slots.filter((slot) => slot.date === selected);
    setFilteredSlots(filtered);
  };

  const handleReserveSlot = async (slot) => {
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

    try {
      const response = await axios.post(
        'https://appointments-server-1-8e83aec0397d.herokuapp.com/api/bookings',
        booking,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage('Slot reserved successfully!');
      console.log('Booking response:', response.data);
    } catch (err) {
      console.error('Error reserving slot:', err);
      setError('Failed to reserve the slot. Please try again later.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Free Slots</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <button
        onClick={() => navigate('/myBookings')}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        View My Bookings
      </button>

      <button
        onClick={handleLogout}
        style={{
          marginBottom: '20px',
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

      <label htmlFor="date" style={{ marginRight: '10px' }}>
        Select a Date:
      </label>
      <select id="date" value={selectedDate} onChange={handleDateChange}>
        <option value="">-- Select a Date --</option>
        {[...new Set(slots.map((slot) => slot.date))].map((date) => (
          <option key={date} value={date}>
            {date || 'No Date Provided'}
          </option>
        ))}
      </select>

      {selectedDate && (
        <div style={{ marginTop: '20px' }}>
          <h3>Available Slots for {selectedDate}</h3>
          {filteredSlots.length > 0 ? (
            <ul>
              {filteredSlots.map((slot) => (
                <li key={slot.slotId} style={{ marginBottom: '10px' }}>
                  Room: {slot.roomNumber || 'N/A'}, Time: {slot.startTime || 'N/A'} -{' '}
                  {slot.endTime || 'N/A'}
                  <button
                    onClick={() => handleReserveSlot(slot)}
                    style={{
                      marginLeft: '10px',
                      padding: '5px 10px',
                      backgroundColor: '#007BFF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Reserve
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No available slots for this date.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FreeSlotsScreen;
