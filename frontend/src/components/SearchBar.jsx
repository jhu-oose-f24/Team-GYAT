import React, { useState } from "react";
import { TextField, List, ListItem, ListItemText, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const items = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape"];

const SearchComponent = (jobs) => {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  console.log(jobs);
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value === "") {
      setFilteredItems([]);
      return;
    }
    const results = items.filter((item) =>
        item.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredItems(results);
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
      <List>
        {filteredItems.map((item, index) => (
          <ListItem key={index}>
          <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default SearchComponent;
