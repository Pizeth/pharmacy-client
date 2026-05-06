// app/loading.tsx
// import Box from "@mui/material/Box";
// import CircularProgress from "@mui/material/CircularProgress";
"use client";

import PulseLoader from "@/components/effect/loaders/loader";
import { Suspense } from "react";

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
  return (
    <Suspense>
      <PulseLoader />
    </Suspense>
  );
}
