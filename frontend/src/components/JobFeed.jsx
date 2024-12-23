import * as React from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { TextField, InputAdornment } from '@mui/material';
import Job from './Job';
import NavBar from './NavBar';
import SearchBar from "./SearchBar";
import { Select, MenuItem, FormControl, InputLabel, Typography, Divider } from '@mui/material';
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;


/**
 * JobFeed Component: Displays a feed of available jobs with filtering, searching, and sorting functionalities.
 */
const JobFeed = () => {
  const [jobs, setJobs] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filter, setFilter] = React.useState('');
  const [filteredJobs, setFilteredJobs] = React.useState([]);
  const [tagFilter, setTagFilter] = React.useState('');
  const [requestedJobs, setRequestedJobs] = React.useState([]);
  const { isSignedIn, userId } = useAuth();
  const navigate = useNavigate();

    // Predefined list of job tags
  const tagList = [
    { value: 'Tutoring', label: 'Tutoring' },
    { value: 'Cleaning', label: 'Cleaning' },
    { value: 'Shopping', label: 'Shopping' },
    { value: 'Dorm Service', label: 'Dorm Service' },
    { value: 'Other', label: 'Other' },
  ];

   // Predefined list of filters
  const filterList = [
    { value: 'price', label: 'Price' },
    { value: 'highToLow', label: 'Price (Ascending)' }
  ];

  /**
   * Fetch jobs from the server on component mount or when userId changes.
   * Ensures the user is signed in; otherwise, redirects to the home page.
   */
  React.useEffect(() => {
    if (!isSignedIn) {
      navigate('/');
    }
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_URL}/jobs`);
        // Filter so you get all jobs where job.user_id != userId
        const filteredJobs = response.data.filter((job) => job.provider_id != userId && job.status === "open");
        setJobs(filteredJobs);
        console.log(response.data);
      } catch (err) {
        console.log(err.message);
      }
    }
    fetchJobs();
  }, [userId, navigate]);

  /**
   * Handles the action when a job is requested by the user.
   * Moves the job to the requested jobs list and removes it from the main job feed.
   * 
   * @param {Object} job - The job object being requested.
   */
  const handleRequestJob = (job) => {
      console.log("handling request job");
    setRequestedJobs([...requestedJobs, job]);
    setJobs(jobs.filter(j => j.job_id !== job.job_id));
  }

  /**
   * Handles changes to the sorting filter.
   * Updates the filter state to apply a new sorting order.
   */
  const handleChange = (e) => {
    setFilter(e.target.value);
  }

  /**
   * Handles updates to the search query.
   * Filters jobs based on the input search text.
   */
  const handleSearch = (e) => {
    setSearchQuery(e);
  }

  /**
   * Handles changes to the tag filter.
   * Filters jobs to show only those matching the selected tag.
   */
  const handleTagChange = (e) => {
    setTagFilter(e.target.value);
  };

  /**
   * Applies filtering, sorting, and searching to the job list whenever related state changes.
   */
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
      if (searchQuery && searchQuery.trim()) {  // Changed from searchedJobs to searchQuery
        sortedJobs = sortedJobs.filter(job => {
          const jobLower = job.title.toLowerCase();
          return jobLower.startsWith(searchQuery.toLowerCase().trim());
        });
      }
      setFilteredJobs(sortedJobs);
    };
    filterJobs();
  }, [filter, tagFilter, jobs, searchQuery]);

  return (
    <Box sx={{ paddingBottom: 5 }}>

      <Typography variant="h4" sx={{ marginLeft: 10, marginTop: 7, fontWeight: 'bold', fontFamily: 'Roboto' }}>Services Offered:</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 10, marginBottom: 5 }}>
        <FormControl sx={{ m: 1, minWidth: 120, marginLeft: 2, marginTop: 7, marginBottom: 5, width: 150 }} size="medium">
          <InputLabel>Price</InputLabel>
          <Select value={filter} label="Filter" onChange={handleChange} >
            <MenuItem sx={{ color: "gray" }} value="">
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
            <MenuItem sx={{ color: "gray" }} value="">
              None
            </MenuItem>
            {tagList.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>

        </FormControl>
        <Box sx={{ marginTop: 2 }}>
          <SearchBar jobs={filteredJobs} onSearch={handleSearch} />
        </Box>
      </Box>

      <Divider sx={{ marginTop: 9 }} />
      <Grid
        container spacing={{ xs: 2, md: 5 }} columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ marginTop: 10, paddingX: 10 }} // Margin top and horizontal padding
      >
        {filteredJobs.map((item, index) => (
          <Grid key={item.job_id} size={{ xs: 2, sm: 4, md: 4 }}>
            <Job jobId={item.job_id} onRequest={handleRequestJob} requested={false} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default JobFeed;
