import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

const StickyFAB = () => {
  return (
    <Box sx={{ position: "fixed", bottom: "2.5vmin", right: "2.5vmin" }}>
      {/* <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab> */}
      <Fab variant="extended" size="medium" color="success" aria-label="add">
        <AddIcon sx={{ mr: 1 }} />
        បញ្ចូលឯកសារថ្មី
      </Fab>
    </Box>
  );
};

export default StickyFAB;
