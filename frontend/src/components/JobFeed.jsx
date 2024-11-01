import * as React from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { TextField, InputAdornment } from '@mui/material';
import Job from './Job';
import NavBar from './NavBar';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import SearchBar from "./SearchBar";

const JobFeed = () => {
  const [jobs, setJobs] = React.useState([]);
  const [filter, setFilter] = React.useState('Price');
  const [filteredJobs, setFilteredJobs] = React.useState([]);

  const filterList = [
    { value: 'price', label: 'Price' },
    { value: 'highToLow', label: 'Price (Ascending)' }
  ];
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

  /*
  Filter jobs based on the selected rp
  */
  const handleChange = (e) => {
    setFilter(e.target.value);
  }
  React.useEffect(() => {
    const filterJobs = () => {
    let sortedJobs = [...jobs];

    switch (filter) {
    case 'price':
      sortedJobs.sort((a, b) => a.price - b.price);
      break;
    case 'highToLow':
      sortedJobs.sort((a, b) => b.price - a.price);
      break;
    }
    setFilteredJobs(sortedJobs);
    };                                                    
    filterJobs();
  }, [filter, jobs]);

  return (
    <Box >
      <NavBar />
      <SearchBar jobs={filteredJobs} />
     <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel>Filter</InputLabel>
      <Select value={filter} label="Filter" onChange={handleChange}>
      {filterList.map((item) => (
        <MenuItem value={item.value}> {item.label} </MenuItem> 
      ))}
      </Select>
      </FormControl>
      <Grid
        container spacing={{ xs: 2, md: 5 }} columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ marginTop: 15, paddingX: 10 }} // Margin top and horizontal padding
      >
        {filteredJobs.map((item, index) => (

          <Grid size={{ xs: 2, sm: 4, md: 4 }}> 
              <Job jobId={item.job_id}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default JobFeed;
