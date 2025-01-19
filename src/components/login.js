import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      const { username, token, role, department, userId } = response.data;
      
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('user', JSON.stringify({ username, role, department, userId }));
      
      setMessage(`Welcome, ${username}!`);
      
      if (role === 'ADMIN') {
        navigate('/adminpage');
      } else {
        navigate('/calendarpage');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        margin: '20px'
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#2d3436',
          marginBottom: '30px',
          fontSize: '28px',
          fontWeight: '600'
        }}>Welcome Back</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="username" 
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#4a5568',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
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
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                transition: 'border-color 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4834d4'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label 
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#4a5568',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
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
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                transition: 'border-color 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4834d4'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
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
              fontSize: '16px',
              fontWeight: '600',
              transition: 'background-color 0.3s ease',
              opacity: loading ? 0.7 : 1
            }}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#3c2ab3')}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#4834d4')}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {message && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: message.includes('Welcome') ? '#e3ffe3' : '#ffe3e3',
            color: message.includes('Welcome') ? '#28a745' : '#ff4757',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}

        <div style={{
          marginTop: '25px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#718096'
        }}>
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/')}
            style={{
              color: '#4834d4',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Register here
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;