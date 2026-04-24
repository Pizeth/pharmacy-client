// import { useRef, useState } from "react";
// import axios from "axios";
// // import debounce from "lodash.debounce";
// import asyncDebounce from "@refinedev/core";
// import zxcvbn from "@zxcvbn-ts/core";

// export const useAsyncFieldValidator = () => {
//   const controllerRef = useRef<AbortController | null>(null);

//   const validate = asyncDebounce(
//     async (url: string, value: string): Promise<string | true> => {
//       if (!value) return true;

//       if (controllerRef.current) {
//         controllerRef.current.abort();
//       }

//       controllerRef.current = new AbortController();

//       try {
//         const res = await axios.get(url, {
//           signal: controllerRef.current.signal,
//         });

//         if (res.data.status === "OK") {
//           return true;
//         }

//         return res.data.message || "Invalid";
//       } catch (e: any) {
//         if (e.name === "CanceledError") return true;
//         return "Validation failed";
//       }
//     },
//     500,
//   );

//   return validate;
// };
