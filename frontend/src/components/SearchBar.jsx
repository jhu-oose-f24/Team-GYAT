import React, { useState, useEffect } from "react";
import { TextField, List, ListItem, ListItemText, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "./AuthContext";
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

const SearchComponent = ({jobs, onSearch}) => {
  const [favoriteTag, setFavoriteTag] = useState("");
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const { userId } = useAuth();
	
  useEffect(() => {
    const getFavoriteTag = async () => {
	  try {
	    const response = await axios.get(`${API_URL}/requested_jobs/${userId}`);
		setFavoriteTag(response.data);
		} catch (error) {
		  console.error('Error fetching favorite tag:', error);
		}
	};
	getFavoriteTag();
  }, [userId]);
		
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };
  console.log(favoriteTag);
		
  return (
    <div style={{ width: "300px", margin: "auto", padding: "20px" }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search..."
        value={query}
        onChange={handleSearch}
        InputProps={{
        startAdornment: (
          <InputAdornment position="start">
          <SearchIcon />
          </InputAdornment>
        ),}}
      />
      </div>
  );
};

export default SearchComponent;
