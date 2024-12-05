import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
const AuthContext = createContext(null);

const API_URL= process.env.REACT_APP_API_URL;

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('googleToken');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = decodedToken.exp * 1000;

      if (expirationTime > Date.now()) {
        setIsSignedIn(true);
        setUserName(decodedToken.given_name || decodedToken.name);
        setUserEmail(decodedToken.email);
        setUserId(decodedToken.sub);
      } else {
        localStorage.removeItem('googleToken');
      }
    }
  }, []);

  const signIn = (token) => {
    localStorage.setItem('googleToken', token);
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    setIsSignedIn(true);
    setUserName(decodedToken.given_name || decodedToken.name);
    setUserEmail(decodedToken.email);
    setUserId(decodedToken.sub);
    console.log(decodedToken.sub, decodedToken.given_name || decodedToken.name, decodedToken.name, decodedToken.email);

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
