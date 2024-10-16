import * as React from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Job from './Job';
import NavBar from './NavBar';

const JobFeed = () => {
  const [jobs, setJobs] = React.useState([]);

  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/jobs');
        setJobs(response.data);
      } catch (err) {
        console.log(err.message);
      }
    }
    fetchJobs();
  }, []);

  return (
    <Box >
      <NavBar />
      <Grid
        container spacing={{ xs: 2, md: 5 }} columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ marginTop: 15, paddingX: 10 }} // Margin top and horizontal padding
      >
        {jobs.map((item, index) => (

          <Grid size={{ xs: 2, sm: 4, md: 4 }}> 
              <Job jobId={item.job_id}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default JobFeed;