import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Select, 
         MenuItem, 
         FormControl, 
         InputLabel, 
         Typography, 
         Divider,
         Grid,
         Box } from '@mui/material';

const CompletedJobs = () => {
    const { isSignedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isSignedIn) {
            navigate('/');
        }
    }, [isSignedIn, navigate]);

    return (
        <Box sx = {{ paddingBottom : 5 }}>
        <h1>Completed Jobs</h1>
      <Typography variant="h6" sx=
        {{ marginLeft: 10, marginTop: 7, fontWeight: 'bold', fontFamily: 'Roboto' }}>
        Provided Jobs Completed:
      </Typography>
      <Grid container spacing={{ xs: 2, md: 5 }} 
                      columns={{ xs: 4, sm: 8, md: 12 }} 
                      sx={{ marginTop: 5, paddingX: 10 }}>
        {/* TODO job rendering logic  requestedJobs.map((item) => (
          <Grid key = {item.job_id} size={{ xs: 2, sm: 4, md: 4 }}>
            <Job jobId={item.job_id} requested={true} onRequest={() => {}}/>
          </Grid>
        ))*/ }
      </Grid>
      
      <Divider sx = {{ marginTop: 9 }} />
      <Typography variant="h6" sx=
        {{ marginLeft: 10, marginTop: 7, fontWeight: 'bold', fontFamily: 'Roboto' }}>
        Requested Jobs Completed:
      </Typography>
      <Grid container spacing={{ xs: 2, md: 5 }} 
                      columns={{ xs: 4, sm: 8, md: 12 }} 
                      sx={{ marginTop: 5, paddingX: 10 }}>
        {/* TODO job rendering logic  requestedJobs.map((item) => (
          <Grid key = {item.job_id} size={{ xs: 2, sm: 4, md: 4 }}>
            <Job jobId={item.job_id} requested={true} onRequest={() => {}}/>
          </Grid>
        ))*/ }
      </Grid>
    </Box>
    );
}

export default CompletedJobs;
