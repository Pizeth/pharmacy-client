import { useState } from "react";
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
    />
  );
};

export default SearchInputWithIcon;

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
