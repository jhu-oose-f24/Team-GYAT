import * as React from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Job from './Job';
import NavBar from './NavBar';
import { Select, MenuItem, FormControl, InputLabel, Typography, Divider } from '@mui/material';

const JobFeed = () => {
  const [jobs, setJobs] = React.useState([]);
  const [filter, setFilter] = React.useState('');
  const [filteredJobs, setFilteredJobs] = React.useState([]);
  const [tagFilter, setTagFilter] = React.useState('');
  const tagList = [
    { value: 'Tutoring', label: 'Tutoring' },
    { value: 'Cleaning', label: 'Cleaning' },
    { value: 'Shopping', label: 'Shopping' },
    { value: 'Dorm Service', label: 'Dorm Service' },
    { value: 'Other', label: 'Other' },
  ];

  const filterList = [
    { value: 'price', label: 'Price' },
    { value: 'highToLow', label: 'Price (Ascending)' }
  ];
  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/jobs');
        setJobs(response.data);
        console.log(response.data);
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

  const handleTagChange = (e) => {
    setTagFilter(e.target.value);
  };

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

      if (tagFilter) {
        sortedJobs = sortedJobs.filter(job => job.tag_name === tagFilter);
      }

      setFilteredJobs(sortedJobs);
    };
    filterJobs();
  }, [filter, tagFilter, jobs]);
  return (
    <Box sx = {{ paddingBottom: 5 }}>
      <NavBar />
      <Typography variant="h4" sx={{ marginLeft: 10, marginTop: 7, fontWeight: 'bold', fontFamily: 'Roboto' }}>Services Offered:</Typography>

      <FormControl sx={{ m: 1, minWidth: 120, marginLeft: 10, marginTop: 7, marginBottom: 5, width: 150 }} size="medium">
        <InputLabel>Price</InputLabel>
        <Select value={filter} label="Filter" onChange={handleChange} >
          <MenuItem sx = {{ color: "gray" }} value="">
            None
          </MenuItem>
          {filterList.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 120, marginTop: 7, marginBottom: 5, width: 150 }} size="medium">
        <InputLabel>Job Types</InputLabel>
        <Select value={tagFilter} label="Job Tags" onChange={handleTagChange}>
          <MenuItem sx = {{ color: "gray" }} value="">
            None
          </MenuItem>
          {tagList.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Divider style={{ margin: '20px 0' }} />
      
      <Grid
        container spacing={{ xs: 2, md: 5 }} columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ marginTop: 10, paddingX: 10 }} // Margin top and horizontal padding
      >
        {filteredJobs.map((item, index) => (

          <Grid size={{ xs: 2, sm: 4, md: 4 }}>
            <Job jobId={item.job_id} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default JobFeed;
