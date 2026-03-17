// app/loading.tsx
// import Box from "@mui/material/Box";
// import CircularProgress from "@mui/material/CircularProgress";
"use client";
import PulseLoader from "@/theme/loaders/loader";

// export default function Loading() {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100vh",
//         width: "100%",
//       }}
//     >
//       <CircularProgress color="primary" size={60} thickness={4} />
//     </Box>
//   );
// }

export default function Loading() {
  return <PulseLoader />;
}
