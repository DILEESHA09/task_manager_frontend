import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by checking if a token exists in localStorage
    const token = localStorage.getItem('access');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/logout/', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        }
      }); // Ensure the correct API endpoint is used
      localStorage.removeItem('access'); // Remove the token from localStorage
      localStorage.removeItem('refresh'); // Remove the refresh token if used
      setIsLoggedIn(false); // Update the state to reflect that the user is logged out
      navigate('/login'); // Redirect to the login page or any other page after logout
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleAuth = () => {
    if (isLoggedIn) {
      handleLogout(); // Call the logout function when the user is logged in
    } else {
      navigate('/login'); // Redirect to the login page
    }
  };

  const handleRegister = () => {
    navigate('/register'); // Redirect to the registration page
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          
        </div>
        <div>
          <button
            onClick={handleAuth}
            className="text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>
          {!isLoggedIn && (
            <button
              onClick={handleRegister}
              className="ml-4 text-white bg-green-500 hover:bg-green-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
