import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import GoogleAuthButtons from './GoogleAuthButtons';
import NavBar from './NavBar';

import {
      Typography,
      Box,
      Button,
      Container,
      Grid,
} from '@mui/material';

function LandingPage() {
    const { isSignedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isSignedIn) {
            navigate('/jobFeed');
        }
    }, [isSignedIn, navigate]);

    return (
        <div>
        <Box
        sx={{
            minHeight: '80vh',
                backgroundImage: 'url(/path/to/your/background/image.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
        }}
        >
        <Container maxWidth="md">
        <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
        <Typography variant="h2" component="h1" gutterBottom>
        Welcome to JHU Marketplace
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
        Connect with your peers to offer and request services within the JHU community.
        </Typography>
        {!isSignedIn && (
            <Box mt={4}>
            <GoogleAuthButtons />
            </Box>
        )}
        </Grid>
        <Grid item xs={12} md={6}>
        { /* if we want to add an image <img
        src="/path/to/your/illustration/image.png"
        alt="Illustration"
        style={{ width: '100%', height: 'auto' }}
        /> */ }
        </Grid>
        </Grid>
        </Container>
        </Box>
        </div>
    );
}

export default LandingPage;

