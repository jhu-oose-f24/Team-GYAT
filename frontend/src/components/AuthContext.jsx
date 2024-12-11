import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create a context to manage authentication state
const AuthContext = createContext(null);

// API URL for backend interactions
const API_URL= process.env.REACT_APP_API_URL;

/**
 * AuthProvider: A context provider component that manages authentication state and actions.
 * 
 * Props:
 * - children: The child components that will consume the authentication context.
 */
export const AuthProvider = ({ children }) => {
  // State variables to manage authentication and user information
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');

  // Effect to check for an existing Google token in localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem('googleToken');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = decodedToken.exp * 1000;

      if (expirationTime > Date.now()) {
        // Token is still valid, update the authentication state
        setIsSignedIn(true);
        setUserName(decodedToken.given_name || decodedToken.name);
        setUserEmail(decodedToken.email);
        setUserId(decodedToken.sub);
      } else {
        // Token is expired, remove it from localStorage
        localStorage.removeItem('googleToken');
      }
    }
  }, []);

   /**
   * signIn: Handles user sign-in by saving the token, updating state, and sending user data to the backend.
   * 
   * @param {string} token - The Google authentication token.
   */
  const signIn = (token) => {
    // Save the token in localStorage
    localStorage.setItem('googleToken', token);

     // Decode the token to extract user details
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    setIsSignedIn(true);
    setUserName(decodedToken.given_name || decodedToken.name);
    setUserEmail(decodedToken.email);
    setUserId(decodedToken.sub);

    // Send the user data to the backend to log in or create an account
    axios.post(`${API_URL}/users/login`, {
      user_id: decodedToken.sub,
      username: decodedToken.given_name || decodedToken.name,
      fullname: decodedToken.name,
      email: decodedToken.email,
    })
    .then(response => {
      console.log('User data saved:', response.data);
    })
    .catch(error => {
      console.error('Error saving user data:', error);
    });
  };

   /**
   * signOut: Handles user sign-out by clearing the token and resetting authentication state.
   */
  const signOut = () => {
    localStorage.removeItem('googleToken');
    setIsSignedIn(false);
    setUserName('');
    setUserEmail('');
    setUserId('');
  };

  return (
    <AuthContext.Provider value={{ 
      isSignedIn, 
        userName, 
        userEmail, 
        userId,
        signIn, 
        signOut 
    }}>
    {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
