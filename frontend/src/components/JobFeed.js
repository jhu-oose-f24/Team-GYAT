import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Job from './Job';

const JobFeed = () => {
  return (
    <Grid 
      container 
      spacing={4} // Space between grid items
      sx={{ marginTop: 5, paddingX: 2 }} // Margin top and horizontal padding
    >
      {/* Define the breakpoints for each grid item */}
      <Grid item xs={12} sm={6} md={4} lg={3}> {/* Dynamically resizes based on screen size */}
        <Job />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Job />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Job />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Job />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Job />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Job />
      </Grid>
    </Grid>
  );
}

export default JobFeed;