// "use client";

// import React, {
//   useState,
//   useEffect,
//   useMemo,
//   createContext,
//   useContext,
// } from "react";
// import {
//   Box,
//   Container,
//   Grid,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   MenuItem,
//   Select,
//   FormControl,
//   IconButton,
// } from "@mui/material";
// import { createTheme, PaletteMode, ThemeProvider } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import SearchIcon from "@mui/icons-material/Search";
// import { Sun, Moon } from "lucide-react";

// // --- THEME CONTEXT ---
// // This context allows you to access and toggle the theme from any component
// const ThemeContext = createContext({ toggleTheme: () => {}, mode: "light" });

// // --- THEME CONFIGURATION (Internalized to prevent import errors) ---
// // const getCustomTheme = (mode: PaletteMode = "light") =>
// //   createTheme({
// //     palette: {
// //       mode,
// //       primary: {
// //         main: "#0D47A1",
// //       },
// //       background: {
// //         default: mode === "dark" ? "#121212" : "#f4f6f8",
// //         paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
// //       },
// //     },
// //     typography: {
// //       fontFamily: '"Battambang", cursive',
// //       h5: { fontFamily: '"Battambang", cursive' },
// //       h6: { fontFamily: '"Moul", serif' },
// //     },
// //     components: {
// //       MuiTextField: {
// //         styleOverrides: {
// //           root: {
// //             backgroundColor: mode === "dark" ? "#2c2c2c" : "#ffffff",
// //             borderRadius: 0,
// //           },
// //         },
// //       },
// //       MuiOutlinedInput: {
// //         styleOverrides: {
// //           root: {
// //             borderRadius: 2,
// //           },
// //         },
// //       },
// //       MuiSelect: {
// //         styleOverrides: {
// //           select: {
// //             backgroundColor: mode === "dark" ? "#2c2c2c" : "#ffffff",
// //             borderRadius: 2,
// //           },
// //         },
// //       },
// //     },
// //   });

// export default function App() {
//   const [mode, setMode] = useState("light");
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     // 1. Load Google Fonts
//     const link = document.createElement("link");
//     link.href =
//       "https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=Moul&display=swap";
//     link.rel = "stylesheet";
//     document.head.appendChild(link);

//     // 2. Initial Theme Detection (Tailwind/Shadcn approach)
//     const savedTheme = localStorage.getItem("theme");
//     const systemDark = window.matchMedia(
//       "(prefers-color-scheme: dark)",
//     ).matches;
//     const initialMode = savedTheme || (systemDark ? "dark" : "light");

//     setMode(initialMode);
//     document.documentElement.classList.toggle("dark", initialMode === "dark");
//     setMounted(true);
//   }, []);

//   const toggleTheme = () => {
//     const newMode = mode === "light" ? "dark" : "light";
//     setMode(newMode);
//     localStorage.setItem("theme", newMode);
//     // This part handles the Tailwind side (class="dark" on <html>)
//     document.documentElement.classList.toggle("dark", newMode === "dark");
//   };

//   const theme = useMemo(() => getCustomTheme(mode), [mode]);

//   // Prevent hydration mismatch by only rendering after mounting
//   if (!mounted) return null;

//   return (
//     <ThemeContext.Provider value={{ toggleTheme, mode }}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <AdministrativeForm />
//       </ThemeProvider>
//     </ThemeContext.Provider>
//   );
// }

// // --- MAIN PAGE COMPONENT ---

// function AdministrativeForm() {
//   const { toggleTheme, mode } = useContext(ThemeContext);

//   return (
//     <Container maxWidth="xl" sx={{ py: 4 }}>
//       {/* --- HEADER --- */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           mb: 4,
//           alignItems: "center",
//         }}
//       >
//         <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//           {/* Logo Placeholder */}
//           <Box
//             sx={{
//               width: 60,
//               height: 60,
//               bgcolor: mode === "dark" ? "#333" : "#eee",
//               borderRadius: "50%",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <span
//               style={{ fontSize: 10, color: mode === "dark" ? "#fff" : "#333" }}
//             >
//               Logo
//             </span>
//           </Box>
//           <Box>
//             <Typography
//               variant="subtitle1"
//               sx={{
//                 fontWeight: "bold",
//                 color: mode === "dark" ? "#fff" : "inherit",
//               }}
//             >
//               ក្រសួងមុខងារសាធារណៈ
//             </Typography>
//             {/* Shadcn-like Theme Toggle */}
//             <IconButton
//               onClick={toggleTheme}
//               color="inherit"
//               sx={{
//                 border: "1px solid",
//                 borderColor: "divider",
//                 mt: 0.5,
//                 borderRadius: 2,
//               }}
//             >
//               {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
//             </IconButton>
//           </Box>
//         </Box>

//         <Box
//           sx={{
//             textAlign: "right",
//             color: mode === "dark" ? "#fff" : "inherit",
//           }}
//         >
//           <Typography variant="h6">ព្រះរាជាណាចក្រកម្ពុជា</Typography>
//           <Typography variant="subtitle1">ជាតិ សាសនា ព្រះមហាក្សត្រ</Typography>
//         </Box>
//       </Box>

//       {/* --- FORM CONTENT --- */}
//       <Typography
//         variant="h5"
//         align="center"
//         sx={{
//           mb: 4,
//           fontWeight: "bold",
//           color: mode === "dark" ? "#90caf9" : "#0D47A1",
//         }}
//       >
//         ប្រព័ន្ធចុះលេខឯកសាររបស់នាយកដ្ឋានធនធានមនុស្ស សម្រាប់ឆ្នាំ២០២៦
//       </Typography>

//       {/* Search Section */}
//       <Paper
//         elevation={0}
//         square
//         sx={{ backgroundColor: "#0D47A1", p: 2, mb: 2 }}
//       >
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} md={2}>
//             <Label text="ស្វែងរកតាម ល.ឧ.ផ.ម" align="left" />
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <TextField fullWidth size="small" />
//           </Grid>
//           <Grid item xs={12} md={2}>
//             <Button
//               variant="contained"
//               startIcon={<SearchIcon />}
//               fullWidth
//               sx={{
//                 bgcolor: "#ECEFF1",
//                 color: "black",
//                 "&:hover": { bgcolor: "#CFD8DC" },
//               }}
//             >
//               ស្វែងរក
//             </Button>
//           </Grid>
//           <Grid
//             item
//             xs={12}
//             md={4}
//             sx={{
//               display: "flex",
//               gap: 1,
//               justifyContent: { xs: "flex-start", md: "flex-end" },
//             }}
//           >
//             <Button
//               variant="contained"
//               sx={{ bgcolor: "#ECEFF1", color: "black" }}
//             >
//               សម្អាត
//             </Button>
//             <Button
//               variant="contained"
//               sx={{ bgcolor: "#ECEFF1", color: "black" }}
//             >
//               លុបទិន្នន័យ
//             </Button>
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* Main Form Fields */}
//       <Paper elevation={0} square sx={{ backgroundColor: "#0D47A1", p: 0 }}>
//         <Box
//           sx={{
//             p: 1,
//             borderBottom: "1px solid rgba(255,255,255,0.2)",
//             textAlign: "center",
//           }}
//         >
//           <Typography sx={{ color: "white", fontWeight: "bold" }}>
//             ព័ត៌មានឯកសារ
//           </Typography>
//         </Box>
//         <Box sx={{ p: 3 }}>
//           <Grid container spacing={2} alignItems="center">
//             {/* Row 1 */}
//             <Grid item xs={12} md={2}>
//               <Label text="ឈ្មោះឯកសារ" />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <TextField fullWidth size="small" />
//             </Grid>
//             <Grid item xs={12} md={2}>
//               <Label text="កាលបរិច្ឆេទ" />
//             </Grid>
//             <Grid item xs={12} md={2}>
//               <TextField fullWidth size="small" type="date" />
//             </Grid>
//             <Grid item xs={12} md={1}>
//               <Label text="ម៉ោង" />
//             </Grid>
//             <Grid item xs={12} md={1}>
//               <TextField fullWidth size="small" />
//             </Grid>

//             {/* Row 2 */}
//             <Grid item xs={12} md={2}>
//               <Label text="កម្រិតស្ថានភាព" />
//             </Grid>
//             <Grid item xs={12} md={2}>
//               <CustomSelect mode={mode} />
//             </Grid>
//             <Grid item xs={12} md={1}>
//               <Label text="ប្រភេទ" />
//             </Grid>
//             <Grid item xs={12} md={2}>
//               <CustomSelect mode={mode} />
//             </Grid>
//             <Grid item xs={12} md={2}>
//               <Label text="ការិយាល័យ" />
//             </Grid>
//             <Grid item xs={12} md={3}>
//               <CustomSelect mode={mode} />
//             </Grid>

//             {/* Row 3 - Action Buttons */}
//             <Grid item xs={12} md={8}></Grid>
//             <Grid item xs={6} md={2}>
//               <Button
//                 variant="contained"
//                 fullWidth
//                 sx={{ bgcolor: "#CFD8DC", color: "black" }}
//               >
//                 បញ្ជូនឯកសារ
//               </Button>
//             </Grid>
//             <Grid item xs={6} md={2}>
//               <Button
//                 variant="contained"
//                 fullWidth
//                 sx={{ bgcolor: "#FF9800", color: "black", fontWeight: "bold" }}
//               >
//                 Upload រូបភាព
//               </Button>
//             </Grid>
//           </Grid>
//         </Box>
//       </Paper>
//     </Container>
//   );
// }

// // --- HELPERS ---

// const Label = ({ text, align = "right" }) => (
//   <Typography
//     sx={{
//       color: "white",
//       textAlign: { xs: "left", md: align },
//       pr: align === "right" ? 1 : 0,
//       fontSize: "0.85rem",
//     }}
//   >
//     {text}
//   </Typography>
// );

// const CustomSelect = ({ mode }) => (
//   <FormControl
//     fullWidth
//     size="small"
//     sx={{
//       backgroundColor: mode === "dark" ? "#2c2c2c" : "white",
//       borderRadius: 1,
//     }}
//   >
//     <Select displayEmpty>
//       <MenuItem value="">
//         <em>ជ្រើសរើស</em>
//       </MenuItem>
//       <MenuItem value={1}>ជម្រើសទី ១</MenuItem>
//       <MenuItem value={2}>ជម្រើសទី ២</MenuItem>
//     </Select>
//   </FormControl>
// );
