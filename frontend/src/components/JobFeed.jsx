import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Job from './Job';
import NavBar from './NavBar';

const JobFeed = () => {
  return (
    <Box >
        <NavBar/>
        <Grid 
        container spacing={{ xs: 2, md: 5 }} columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ marginTop: 20, paddingX: 10 }} // Margin top and horizontal padding
        >
        <Grid size={{ xs: 2, sm: 4, md: 4 }}> 
            <Job />
        </Grid>
        <Grid size={{ xs: 2, sm: 4, md: 4 }}>
            <Job />
        </Grid>
        <Grid size={{ xs: 2, sm: 4, md: 4 }}>
            <Job />
        </Grid>
        <Grid size={{ xs: 2, sm: 4, md: 4 }}>
            <Job />
        </Grid>
        <Grid size={{ xs: 2, sm: 4, md: 4 }}>
            <Job />
        </Grid>
        <Grid size={{ xs: 2, sm: 4, md: 4 }}>
            <Job />
        </Grid>
        
        </Grid>
    </Box>
  );
}

export default JobFeed;