import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import IconInput from "../CustomInputs/IconInput";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const SearchInputWithIcon = () => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchValue);
    // Add your search logic here
  };

  return (
    <IconInput
      source="search"
      className="icon-input"
      label="ស្វែងរកឯកសារតាមរយៈ ល.ន.ធ.ម"
      fullWidth
      iconStart={
        <SearchOutlinedIcon sx={{ transform: "scaleX(-1)" }} color="error" />
      }
      resettable
      onChange={(e) => setSearchValue(e ? e.target.value : "")}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSearch();
        }
      }}
      variant="outlined"
      sx={{
        "& .MuiInputBase-root": {
          backgroundColor: "var(--app-palette-background-paper)", // Your custom background color
          //   transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          boxShadow: "var(--Paper-shadow)",
          //   backgroundImage: "var(--Paper-overlay)",
        },
      }}
    />
    // <TextField
    //   label="Search"
    //   variant="outlined"
    //   value={searchValue}
    //   onChange={(e) => setSearchValue(e.target.value)}
    //   onKeyDown={(e) => {
    //     if (e.key === "Enter") {
    //       handleSearch();
    //     }
    //   }}
    //   //   slotProps={{
    //   //     input: {
    //   //       startAdornment: (
    //   //         <InputAdornment position="start">
    //   //           <IconButton onClick={handleSearch} edge="end">
    //   //             <SearchIcon />
    //   //           </IconButton>
    //   //         </InputAdornment>
    //   //       ),
    //   //     },
    //   //   }}
    //   InputProps={{
    //     endAdornment: (
    //       <InputAdornment position="end">
    //         <IconButton onClick={handleSearch} edge="end">
    //           <SearchIcon />
    //         </IconButton>
    //       </InputAdornment>
    //     ),
    //   }}
    // />
  );
};

export default SearchInputWithIcon;
