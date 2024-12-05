import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';
import Job from './Job';
import axios from 'axios';

import { Select, 
         MenuItem, 
         FormControl, 
         InputLabel, 
         Typography, 
         Divider,
         Grid,
         Box } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL;

const PendingJobs = () => {
    const { userId } = useAuth();
    const [providingJobs, setProvidingJobs] = useState({
        open: [],
        awaitingCompletion: [],
        awaitingApproval: []
    });
    const [requestedJobs, setRequestedJobs] = useState({
        awaitingCompletion: [],
        awaitingApproval: []
    });

    const navigate = useNavigate();

    const fetchJobs = async () => {
        const response = await axios.get(`${API_URL}/jobs`);
        const jobs = response.data;

        const providingOpen = 
            jobs.filter(job => job.provider_id === userId && job.status === 'open');
        const providingAwaitingCompletion = 
            jobs.filter(job => job.provider_id === userId && job.status === 'accepted');
        const providingAwaitingApproval = 
            jobs.filter(job => job.provider_id === userId && job.status === 'provider_done');

        const requestedAwaitingCompletion = 
            jobs.filter(job => job.requester_id === userId && job.status === 'accepted');
        const requestedAwaitingApproval = 
            jobs.filter(job => job.requester_id === userId && job.status === 'provider_done');

        setProvidingJobs({
            open: providingOpen,
            awaitingCompletion: providingAwaitingCompletion,
            awaitingApproval: providingAwaitingApproval
        });
        setRequestedJobs({
            awaitingCompletion: requestedAwaitingCompletion,
            awaitingApproval: requestedAwaitingApproval
        });
    }

    const [refreshKey, setRefreshKey] = useState(0);


    useEffect(() => {
        if (!userId) {
            navigate('/');
        }
        fetchJobs();
    }, [userId, navigate, refreshKey]);

    return (
        <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>Pending Jobs</Typography>
        

        <Typography variant="h5" gutterBottom>Jobs I'm Providing</Typography>
        <Typography variant="h6" sx={{ marginLeft: 10, marginTop: 3}}>Open Jobs</Typography>
        <Grid container spacing={2}>
        {providingJobs.open.map(job => (
            <Grid item xs={12} sm={6} md={4} key={job.job_id}>
            <Job jobId={job.job_id} refresh={setRefreshKey}/>
            </Grid>
        ))}
        </Grid>

        <Typography variant="h6" sx={{ marginLeft: 10, marginTop: 7}}>Awaiting Completion</Typography>
        <Grid container spacing={2}>
        {providingJobs.awaitingCompletion.map(job => (
            <Grid item xs={12} sm={6} md={4} key={job.job_id}>
            <Job jobId={job.job_id} refresh={setRefreshKey}/>
            </Grid>
        ))}
        </Grid>

        <Typography variant="h6" sx={{ marginLeft: 10, marginTop: 7}}>Awaiting Requester Approval</Typography>
        <Grid container spacing={2}>
        {providingJobs.awaitingApproval.map(job => (
            <Grid item xs={12} sm={6} md={4} key={job.job_id}>
            <Job jobId={job.job_id} refresh={setRefreshKey}/>
            </Grid>
        ))}
        </Grid>

      <Divider sx = {{ marginTop: 7 }} />

        <Typography variant="h5" gutterBottom sx={{marginTop: 3}}>Jobs I've Requested</Typography>
        <Typography variant="h6" sx={{ marginLeft: 10, marginTop: 7}}>Awaiting Provider Completion</Typography>
        <Grid container spacing={2}>
        {requestedJobs.awaitingCompletion.map(job => (
            <Grid item xs={12} sm={6} md={4} key={job.job_id}>
            <Job jobId={job.job_id} refresh={setRefreshKey}/>
            </Grid>
        ))}
        </Grid>

        <Typography variant="h6" sx={{ marginLeft: 10, marginTop: 7}}>Awaiting Approval</Typography>
        <Grid container spacing={2}>
        {requestedJobs.awaitingApproval.map(job => (
            <Grid item xs={12} sm={6} md={4} key={job.job_id}>
            <Job jobId={job.job_id} refresh={setRefreshKey}/>
            </Grid>
        ))}
        </Grid>
        </Box>
    );
};

export default PendingJobs;

