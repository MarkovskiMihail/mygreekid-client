import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is being used

const LoginScreen = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate(); // React Router's navigation function
  const API_URL = process.env.REACT_APP_API_URL;

  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setToken('');
  
    try {
      // Make the API request
      const response = await axios.post(`${API_URL}/auth/login`, formData);
  
      // Extract data from the response
      const { username, token, role, department, userId } = response.data;
  
      // Store the token and user details in localStorage
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('user', JSON.stringify({ username, role, department, userId }));
  
      // Set the state with the retrieved data
      setMessage(`Welcome, ${username}!`);
      setToken(token);
      console.log('JWT Token:', token);

      // Navigate based on the role
      if (role === 'ADMIN') {
        navigate('/adminpage');
      } else {
        navigate('/calendarpage');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Login</h2>
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
            cursor: 'pointer',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {message && <p style={{ marginTop: '20px', color: message.includes('Welcome') ? 'green' : 'red' }}>{message}</p>}

      {token && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px' }}>
          <strong>JWT Token:</strong>
          <p style={{ wordWrap: 'break-word' }}>{token}</p>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
