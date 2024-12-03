import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, Divider } from '@mui/material';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Import the useAuth hook from AuthContext

const UserProfile = () => {
  const { userId, isSignedIn } = useAuth(); // Access userId and isSignedIn from AuthContext
  const [user, setUser] = useState(null); // Start as null until data is fetched
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !isSignedIn) {
      setError('User is not signed in. Please log in.');
      return;
    }

    // Fetch user data on component load
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://task-market-7ba3283496a7.herokuapp.com/users/${userId}`);
        setUser(response.data); // Set fetched user data
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Unable to load user profile. Please try again later.');
      }
    };

    fetchUserData();
  }, [userId, isSignedIn]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(`https://task-market-7ba3283496a7.herokuapp.com/users/${userId}`, user);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  if (error) {
    return (
      <Typography
        sx={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}
      >
        {error}
      </Typography>
    );
  }

  if (!user) {
    // Show loading state until user data is fetched
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Card
        sx={{
          maxWidth: 600,
          margin: '2rem auto',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      >
        <CardContent>
          {/* Name Field */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: 'darkblue', fontWeight: 'bold' }}
          >
            {isEditing ? (
              <TextField
                label="Full Name"
                name="fullname"
                value={user.fullname || ''}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            ) : (
              user.fullname
            )}
          </Typography>

          <Divider sx={{ marginBottom: '1rem' }} />

          {/* Username Field */}
          <Box sx={{ marginBottom: '1rem' }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Username:
            </Typography>
            <Typography variant="body1">
              {isEditing ? (
                <TextField
                  label="Username"
                  name="username"
                  value={user.username || ''}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              ) : (
                user.username
              )}
            </Typography>
          </Box>

          {/* Email Field */}
          <Box sx={{ marginBottom: '1rem' }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Email:
            </Typography>
            <Typography variant="body1">
              {isEditing ? (
                <TextField
                  label="Email"
                  name="email"
                  value={user.email || ''}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              ) : (
                user.email
              )}
            </Typography>
          </Box>

          {/* Year Field */}
          <Box sx={{ marginBottom: '1rem' }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Year:
            </Typography>
            <Typography variant="body1">
              {isEditing ? (
                <TextField
                  label="Year"
                  name="year"
                  value={user.year || ''}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              ) : (
                user.year || 'None'
              )}
            </Typography>
          </Box>

          {/* Provided Jobs Field */}
          <Box sx={{ marginBottom: '1rem' }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Provided Jobs:
            </Typography>
            <Typography variant="body1">None</Typography>
          </Box>

          {/* Requested Jobs Field */}
          <Box sx={{ marginBottom: '2rem' }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Requested Jobs:
            </Typography>
            <Typography variant="body1">None</Typography>
          </Box>

          {/* Edit/Save Button */}
          {isEditing ? (
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default UserProfile;
