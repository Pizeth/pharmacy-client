"use client";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import Image from "next/image";
import SearchInputWithIcon from "./searchBox";
import { FormProvider, useForm } from "react-hook-form";
import EnhancedTable from "./table";
import StickyFAB from "../CustomComponents/StickyFab";
import DocumentTable from "./testTable";

export default function AdministrativeForm() {
  const methods = useForm();
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* --- HEADER --- */}
      <Box
        sx={{
          display: { xs: "none", md: "inherit" },
          justifyContent: "space-between",
          mb: 7,
        }}
      >
        <Grid container spacing={0}>
          {/* Logo Section */}
          <Grid
            size={{ xs: 12, md: 2 }}
            sx={{
              position: "relative",
              /*** New CSS ***/
              // overflow: "hidden", // prevents scrollbars
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                position: "relative",
                zIndex: 2,

                aspectRatio: "1 / 1",

                width: 100,
                overflow: "visible",
                inset: 0,
                objectFit: "cover",
              }}
            >
              <Image
                src="/static/images/logo.svg"
                alt="Logo"
                preload={false}
                loading="eager"
                fill
                style={{ objectFit: "contain" }}
                unoptimized
              />
              <Box
                sx={{
                  position: "absolute",
                  top: (theme) =>
                    `calc(100% + ${theme.custom.sideImage.captionOffset.xs})`,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 2,
                  // 👇 key changes
                  whiteSpace: "nowrap", // prevent wrapping
                  overflow: "visible", // allow text to extend beyond logo box
                  maxWidth: "none", // remove inherited width limit
                  color: "#edad54",
                  textAlign: "center",
                  fontSize: (theme) =>
                    theme.custom.sideImage.captionFontSize.xs,
                  textShadow: (theme) => `
                      -0.5px -0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
                      0.5px -0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
                      -0.5px  0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
                      0.5px  0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
                      0    0   7px ${theme.custom.sideImage.captionGlowColor}
                    `,
                  WebkitTextStroke: (theme) =>
                    `0.125px ${theme.custom.sideImage.captionOutlineColor}`,
                }}
              >
                <Typography variant="h6">ក្រសួងមុខងារសាធារណៈ</Typography>
              </Box>
            </Box>
          </Grid>
          {/* National Motto Section */}
          <Grid size={{ xs: 12, md: 3 }} offset={{ md: 7 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5" sx={{ mb: 1 }}>
                ព្រះរាជាណាចក្រកម្ពុជា
              </Typography>
              <Typography variant="h6">ជាតិ សាសនា ព្រះមហាក្សត្រ</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {/* --- MAIN TITLE --- */}
      <Typography
        variant="h6"
        align="center"
        sx={{
          mb: 2.5,
        }}
      >
        ប្រព័ន្ធចរន្តឯកសាររបស់នាយកដ្ឋានធនធានមនុស្ស
      </Typography>
      <FormProvider {...methods}>
        <form>
          {/* --- SEARCH BOX --- */}
          {/* Note: In Grid2, we don't use 'item'. We use 'size' */}
          <Paper elevation={3} square variant="outlined">
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }} offset={{ md: 4 }} px={1}>
                <SearchInputWithIcon />
              </Grid>
            </Grid>
          </Paper>
          <EnhancedTable />
          <DocumentTable />
          <StickyFAB />
        </form>
      </FormProvider>
    </Container>
  );
}

{
  /* --- MAIN FORM (Blue Box 2) --- */
}
{
  /* <Paper elevation={0} square sx={{ backgroundColor: "#0D47A1", p: 0 }}>
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
</Paper>; */
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
