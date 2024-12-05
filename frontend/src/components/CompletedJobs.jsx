import React, { useEffect, useState } from 'react';
import Job from "./Job"
import axios from "axios"
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

const API_URL = process.env.REACT_APP_API_URL;

const CompletedJobs = () => {
    const { isSignedIn, userId  } = useAuth();
    const navigate = useNavigate();

    const [providedJobs, setProvidedJobs] = useState([]);
    const [requestedJobs, setRequestedJobs] = useState([]);

    const fetchCompletedJobs = async () => {
        try {
            const response = await axios.get(`${API_URL}/jobs`);
            const jobs = response.data;

            const provided = jobs.filter(
                (job) => job.provider_id === userId && job.status ===  'finished'
            );

            const requested = jobs.filter(
                (job) => job.requester_id === userId && job.status === 'finished'
            );

            setProvidedJobs(provided);
            setRequestedJobs(requested);
        } catch (err) {
            console.error("Error fetching completed jobs", err);
        }
    };

    useEffect(() => {
        if (!isSignedIn) {
            navigate('/');
        }
        fetchCompletedJobs();
    }, [isSignedIn, navigate, userId]);

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
        {providedJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.job_id}>
                <Job jobId={job.job_id} />
            </Grid>
        )) }
      </Grid>
      
      <Divider sx = {{ marginTop: 9 }} />
      <Typography variant="h6" sx=
        {{ marginLeft: 10, marginTop: 7, fontWeight: 'bold', fontFamily: 'Roboto' }}>
        Requested Jobs Completed:
      </Typography>
      <Grid container spacing={{ xs: 2, md: 5 }} 
                      columns={{ xs: 4, sm: 8, md: 12 }} 
                      sx={{ marginTop: 5, paddingX: 10 }}>
        {requestedJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.job_id}>
                <Job jobId={job.job_id} />
            </Grid>
        )) }
      </Grid>
    </Box>
    );
}

export default CompletedJobs;
