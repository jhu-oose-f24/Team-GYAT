import React, { useState } from "react";
import { TextField, List, ListItem, ListItemText, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

/**
 * SearchComponent: A reusable search bar component that allows filtering and querying.
 *
 * Props:
 * - jobs: Array of job objects to be filtered (optional in this implementation).
 * - onSearch: Callback function triggered whenever the search input changes, 
 *   passing the current query value to the parent component for processing.
 */
const SearchComponent = ({jobs, onSearch}) => {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  /**
   * Handles changes in the search input field.
   * Updates the query state and triggers the `onSearch` callback to communicate
   * the search value to the parent component.
   * 
   * @param {object} e - The input change event.
   */
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
