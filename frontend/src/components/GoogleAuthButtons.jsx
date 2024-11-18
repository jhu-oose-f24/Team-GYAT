/* global google */
import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { useAuth } from './AuthContext';

const GoogleAuthButtons = () => {
  const { isSignedIn, userName, signIn, signOut } = useAuth();

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      return script;
    };

    const script = loadGoogleScript();

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '122127252195-02c10jh336ucqb3d80pma4galdafg6dg.apps.googleusercontent.com',
          callback: handleCredentialResponse
        });

        if (!isSignedIn) {
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            { 
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
              shape: 'rectangular',
            }
          );
        }
      }
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [isSignedIn]);

  const handleCredentialResponse = (response) => {
    signIn(response.credential);
  };

  const handleSignOut = () => {
    if (window.google?.accounts?.id) {
      google.accounts.id.disableAutoSelect();
      signOut();
    }
  };

  return (
    <div sx={{ ml: 1 }}>
    {!isSignedIn ? (
      <div id="google-signin-button"></div>
    ) : (
      <Button
      color="inherit"
      onClick={handleSignOut}
      sx={{
        ml: 1,
          textTransform: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 1
      }}
      >
      <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginRight: '4px' }}
      >
      <path
      d="M15 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H15M8 8L4 12M4 12L8 16M4 12H16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      />
      </svg>
      Sign Out ({userName})
      </Button>
    )}
    </div>
  );
};

export default GoogleAuthButtons;
