import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is being used
import axios from 'axios';

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    location: '',
    department: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // React Router's navigation function
  const API_URL = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = (e) => {
    const location = e.target.value;
    const department = location === 'ATHENS' 
      ? 'Athens_Police_Department' 
      : 'Thessaloniki_Police_Department';
    
    setFormData(prev => ({
      ...prev,
      location: location,
      department: department
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/auth/register`,
        {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          department: formData.department,
          location: formData.location
        }
      );

      setMessage('Registration successful!');
      console.log(response.data);
      navigate('/login')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '35px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Register</h2>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="location" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
            Location
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleLocationChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          >
            <option value="">Select Location</option>
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
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            marginBottom: '15px',
          }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <button
        onClick={() => navigate('/login')} // Redirect to login page
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: 'white',
          color: '#007BFF',
          border: '1px solid #007BFF',
          borderRadius: '5px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Already have an account? Login
      </button>

      {message && (
        <p
          style={{
            marginTop: '20px',
            textAlign: 'center',
            color: message.includes('successful') ? 'green' : 'red',
            fontWeight: 'bold',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default RegisterScreen;