import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',  // Changed from 'email' to 'username'
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://127.0.0.1:8000/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Login successful!');
    
      localStorage.setItem('access', data.access); // Store JWT access token
      localStorage.setItem('refresh', data.refresh); // Optionally store refresh token
      setFormData({ username: '', password: '' });
      window.location.href = '/'; // Redirect to home or dashboard page
    } else {
      setMessage(data.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {message && <p className="text-center text-red-500">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
            <input
              type="text"
              name="username"  // Changed from 'email' to 'username'
              value={formData.username}  // Changed from 'email' to 'username'
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
          
          <Link 
            to="/register" 
            className="text-blue-500 hover:text-blue-700 font-semibold underline"
          >
            Don't have an account? Signup
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
