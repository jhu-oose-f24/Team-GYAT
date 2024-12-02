import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

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

    axios.post('https://your-backend-url/users/login', {
      google_id: decodedToken.sub,
      name: decodedToken.name,
      email: decodedToken.email,
    }).catch((error) => {
      console.error('Error logging in:', error);
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
