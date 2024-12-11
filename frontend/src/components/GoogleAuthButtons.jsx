/* global google */

import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { useAuth } from './AuthContext';

/**
 * GoogleAuthButtons: A component to manage Google sign-in and sign-out functionalities.
 */
const GoogleAuthButtons = () => {
  // Destructuring the authentication context values
  const { isSignedIn, userName, signIn, signOut } = useAuth();

   // Effect to dynamically load the Google Sign-In script and initialize the Google API
  useEffect(() => {
    /**
     * Dynamically loads the Google Sign-In client script into the document.
     * @returns {HTMLScriptElement} The script element added to the document.
     */
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      return script;
    };

    const script = loadGoogleScript();

    // Initialize the Google Sign-In client after the script loads
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '122127252195-02c10jh336ucqb3d80pma4galdafg6dg.apps.googleusercontent.com',
          callback: handleCredentialResponse
        });

        // Render the Google Sign-In button if the user is not signed in
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

   /**
   * Handles the credential response from Google Sign-In.
   * @param {Object} response - The response object from Google Sign-In.
   */
  const handleCredentialResponse = (response) => {
    signIn(response.credential);
  };

  /**
   * Handles the Google Sign-Out process.
   */
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
