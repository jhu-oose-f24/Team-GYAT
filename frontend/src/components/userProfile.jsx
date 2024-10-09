import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, Divider } from '@mui/material';
import NavBar from './NavBar';

const UserProfile = () => {
  const [user, setUser] = useState({
    fullName: 'John Doe',
    userName: 'john_doe',
    email: 'john@example.com',
    year: '2024',
    providedJobs: 'Job 1, Job 2',
    requestedJobs: 'Job A, Job B'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  return (
    <>
      <NavBar />
      <Card 
        sx={{ 
          maxWidth: 600, 
          margin: '2rem auto', 
          padding: '1rem', 
          border: '1px solid #ccc',
          borderRadius: '8px'
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
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            ) : (
              user.fullName
            )}
          </Typography>

          <Divider sx={{ marginBottom: '1rem' }} />

          {/* Username Field */}
          <Box sx={{ marginBottom: '1rem' }}>
            {!isEditing && <Typography variant="subtitle2" fontWeight="bold">Username:</Typography>}
            <Typography variant="body1">
              {isEditing ? (
                <TextField
                  label="Username"
                  name="userName"
                  value={user.userName}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              ) : (
                user.userName
              )}
            </Typography>
          </Box>

          {/* Email Field */}
          <Box sx={{ marginBottom: '1rem' }}>
            {!isEditing && <Typography variant="subtitle2" fontWeight="bold">Email:</Typography>}
            <Typography variant="body1">
              {isEditing ? (
                <TextField
                  label="Email"
                  name="email"
                  value={user.email}
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
            {!isEditing && <Typography variant="subtitle2" fontWeight="bold">Year:</Typography>}
            <Typography variant="body1">
              {isEditing ? (
                <TextField
                  label="Year"
                  name="year"
                  value={user.year}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              ) : (
                user.year
              )}
            </Typography>
          </Box>

          {/* Provided Jobs Field*/}
          <Box sx={{ marginBottom: '1rem' }}>
            <Typography variant="subtitle2" fontWeight="bold">Provided Jobs:</Typography>
            <Typography variant="body1">
              {user.providedJobs || 'None'}
            </Typography>
          </Box>

          {/* Requested Jobs Field */}
          <Box sx={{ marginBottom: '2rem' }}>
            <Typography variant="subtitle2" fontWeight="bold">Requested Jobs:</Typography>
            <Typography variant="body1">
              {user.requestedJobs || 'None'}
            </Typography>
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
