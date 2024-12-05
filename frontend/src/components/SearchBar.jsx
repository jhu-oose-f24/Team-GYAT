import React, { useState, useEffect } from "react";
import { TextField, List, ListItem, ListItemText, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "./AuthContext";
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

const SearchComponent = ({jobs, onSearch}) => {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  		
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };
		
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
