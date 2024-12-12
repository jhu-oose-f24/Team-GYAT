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

/**
 * PendingJobs Component: Displays lists of jobs grouped by their status for the authenticated user.
 */
const PendingJobs = () => {
    const { userId } = useAuth();
    // State to store jobs provided by the user, categorized by status
    const [providingJobs, setProvidingJobs] = useState({
        open: [],
        awaitingCompletion: [],
        awaitingApproval: []
    });
     // State to store jobs requested by the user, categorized by status
    const [requestedJobs, setRequestedJobs] = useState({
        awaitingCompletion: [],
        awaitingApproval: []
    });

    const navigate = useNavigate();

     /**
     * Fetches all jobs and categorizes them based on their status and user roles (provider/requester).
     */
    const fetchJobs = async () => {
        const response = await axios.get(`${API_URL}/jobs`);
        const jobs = response.data;

        // Categorize jobs provided by the user
        const providingOpen = 
            jobs.filter(job => job.provider_id === userId && job.status === 'open');
        const providingAwaitingCompletion = 
            jobs.filter(job => job.provider_id === userId && job.status === 'accepted');
        const providingAwaitingApproval = 
            jobs.filter(job => job.provider_id === userId && job.status === 'provider_done');

        // Categorize jobs requested by the user
        const requestedAwaitingCompletion = 
            jobs.filter(job => job.requester_id === userId && job.status === 'accepted');
        const requestedAwaitingApproval = 
            jobs.filter(job => job.requester_id === userId && job.status === 'provider_done');

        // Update state with categorized jobs
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

    /**
     * Fetch jobs when the component mounts or when `refreshKey` changes.
     */
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

