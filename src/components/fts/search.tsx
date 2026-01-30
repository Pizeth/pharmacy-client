"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Select,
  FormControl,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useThemeControl } from "../effect/themes/theme-wrapper";

export default function AdministrativeForm() {
  // const { toggleTheme, mode } = useThemeControl();
  return (
    // <ThemeProvider theme={darkTheme}>
    //   <CssBaseline />
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* --- HEADER --- */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 4,
          alignItems: "center",
        }}
      >
        {/* Logo Section */}
        {/* <Box sx={{ display: "flex", flexDirection: "column" }}> */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {/* Placeholder for Logo */}
          <Box
            sx={{
              width: 80,
              height: 80,
              bgcolor: "#eee",
              borderRadius: "50%",
              mb: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
            // style={{ fontSize: 10, color: mode === "dark" ? "#fff" : "#333" }}
            >
              Logo
            </span>
          </Box>
          <Typography variant="h6">ក្រសួងមុខងារសាធារណៈ</Typography>
        </Box>

        {/* National Motto Section */}
        <Box sx={{ textAlign: "right" }}>
          {/* <IconButton
            onClick={toggleTheme}
            color="inherit"
            sx={{
              border: "1px solid",
              borderColor: "divider",
              mt: 0.5,
              borderRadius: 2,
            }}
          >
            {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </IconButton> */}
          <Typography variant="h6" sx={{ color: "#333" }}>
            ព្រះរាជាណាចក្រកម្ពុជា
          </Typography>
          <Typography variant="subtitle1">ជាតិ សាសនា ព្រះមហាក្សត្រ</Typography>
        </Box>
      </Box>

      {/* --- MAIN TITLE --- */}
      <Typography
        variant="h5"
        align="center"
        sx={{
          mb: 4,
          fontWeight: "bold",
          // color: mode === "dark" ? "#90caf9" : "#0D47A1",
        }}
      >
        ប្រព័ន្ធចុះលេខឯកសាររបស់នាយកដ្ឋានធនធានមនុស្ស សម្រាប់ឆ្នាំ២០២៦
      </Typography>

      {/* --- SEARCH BOX --- */}
      {/* Note: In Grid2, we don't use 'item'. We use 'size' */}
      <Paper
        elevation={0}
        square
        sx={{
          // backgroundColor: mode === "dark" ? "#0D47A1" : "#0D47A1",
          p: 2,
          mb: 2,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 2 }}>
            <Label text="ស្វែងរកឯកសារតាមរយៈ ល.ឧ.ផ.ម" align="left" />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth size="small" variant="outlined" />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              fullWidth
              sx={{
                bgcolor: "#ECEFF1",
                color: "black",
                "&:hover": { backgroundColor: "#CFD8DC" },
              }}
            >
              ស្វែងរក
            </Button>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: { xs: "flex-start", md: "flex-end" },
              }}
            >
              <Button
                variant="contained"
                sx={{ backgroundColor: "#ECEFF1", color: "black" }}
              >
                សម្អាត
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#ECEFF1", color: "black" }}
              >
                លុបទិន្នន័យ
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* --- MAIN FORM (Blue Box 2) --- */}
      <Paper elevation={0} square sx={{ backgroundColor: "#0D47A1", p: 0 }}>
        <Box
          sx={{
            p: 1,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            textAlign: "center",
          }}
        >
          <Typography
            align="center"
            sx={{
              // color: mode === "dark" ? "#ECEFF1" : "#0D47A1",
              fontWeight: "bold",
            }}
          >
            ព័ត៌មានឯកសារ
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Row 1: Document Name & Date */}
            <Grid size={{ xs: 12, md: 2 }}>
              <Label text="ឈ្មោះឯកសារ" />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth size="small" />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Label text="កាលបរិច្ឆេទលិខិតចូល" />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField fullWidth size="small" type="date" />
            </Grid>

            <Grid size={{ xs: 12, md: 1 }}>
              <Label text="ម៉ោងចូល" />
            </Grid>
            <Grid size={{ xs: 12, md: 1 }}>
              <TextField fullWidth size="small" />
            </Grid>

            {/* Row 2: Status, Type, Office */}
            <Grid size={{ xs: 12, md: 2 }}>
              <Label text="កម្រិតនៃស្ថានភាព" />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <CustomSelect />
            </Grid>

            <Grid size={{ xs: 12, md: 1 }}>
              <Label text="ប្រភេទ" />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <CustomSelect />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Label text="ការិយាល័យទទួលបន្ទុក" />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <CustomSelect />
            </Grid>

            {/* Row 3: Leave Type, Receiver, Buttons */}
            <Grid size={{ xs: 12, md: 2 }}>
              <Label text="ប្រភេទច្បាប់របស់សម្រាក" />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <CustomSelect />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Label text="អ្នកទទួលឯកសារ" />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <CustomSelect />
            </Grid>

            {/* Action Buttons */}
            <Grid size={{ xs: 6, md: 2 }}>
              <Button
                variant="contained"
                fullWidth
                sx={{ backgroundColor: "#CFD8DC", color: "black" }}
              >
                បញ្ជូនឯកសារ
              </Button>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#FF9800",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                }}
              >
                Upload រូបភាព
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
    // </ThemeProvider>
  );
}

// --- MOCK DATA ---
const dropdownOptions = [
  { value: 1, label: "ជម្រើសទី ១ (Option 1)" },
  { value: 2, label: "ជម្រើសទី ២ (Option 2)" },
];

// --- HELPER COMPONENTS ---

// Label Component
const Label = ({ text, align = "right" }: { text: string; align?: string }) => (
  <Typography
    sx={{
      color: "white",
      textAlign: { xs: "left", md: align },
      pr: align === "right" ? 1 : 0,
      fontSize: "0.9rem",
    }}
  >
    {text}
  </Typography>
);

// Select Component
const CustomSelect = () => (
  <FormControl
    fullWidth
    size="small"
    sx={{ backgroundColor: "white", borderRadius: 1 }}
  >
    <Select displayEmpty inputProps={{ "aria-label": "Without label" }}>
      <MenuItem value="">
        <em>ជ្រើសរើស</em>
      </MenuItem>
      {dropdownOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

// const CustomSelect = ({ mode }: { mode: "light" | "dark" }) => (
//   <FormControl
//     fullWidth
//     size="small"
//     sx={{
//       backgroundColor: mode === "dark" ? "#2c2c2c" : "white",
//       borderRadius: 1,
//     }}
//   >
//     <Select displayEmpty inputProps={{ "aria-label": "Without label" }}>
//       <MenuItem value="">
//         <em>ជ្រើសរើស</em>
//       </MenuItem>
//       {dropdownOptions.map((option) => (
//         <MenuItem key={option.value} value={option.value}>
//           {option.label}
//         </MenuItem>
//       ))}
//     </Select>
//   </FormControl>
// );
