// import axios from "axios";
// import statusCode from "http-status-codes";
// // import lazyZxcvbn from "./lazyZxcvbn";
// // import debounce from "lodash.debounce";
// import { debounce } from "es-toolkit/function";
// // import zxcvbn from "@zxcvbn-ts/core";
// import { ValidationState } from "@/interfaces/auth.interface";
// import zxcvbn from "@/utils/lazyZxcvbn";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// const zxcvbnAsync = await zxcvbn.loadZxcvbn();

// let validationController: AbortController | null = null;
// export const asyncFieldValidator = debounce(
//   async (
//     source: string,
//     value: string,
//     onResult: (res: ValidationState) => void,
//   ) => {
//     // 1. Setup AbortController
//     if (validationController) validationController.abort();
//     validationController = new AbortController();

//     onResult({ message: "Checking...", status: "loading" });

//     if (!value) return true;

//     try {
//       const response = await axios.get(
//         `${API_URL}/validate/${source}/${value}`,
//         {
//           signal: validationController.signal,
//         },
//       );

//       const { status, message } = response.data;

//       if (status === statusCode.OK) {
//         onResult({ message: message || "Available", status: "success" });
//       } else {
//         onResult({ message: message || "Invalid", status: "error" });
//       }
//     } catch (error) {
//       if (axios.isCancel(error)) return;
//       onResult({
//         message: "Validation service unavailable",
//         status: "error",
//       });
//     }
//   },
//   500,
// );

// export const usePasswordStrength = () => {
//   const [strength, setStrength] = useState({
//     score: 0,
//     feedback: "",
//   });

//   const validate = async (value: string) => {
//     if (!value) {
//       setStrength({ score: 0, feedback: "" });
//       return "Password is required";
//     }

//     const result = await zxcvbn(value);

//     setStrength({
//       score: result.score,
//       feedback: result.feedback.suggestions.join(" "),
//     });

//     if (result.score < 3) {
//       return result.feedback.warning || "Weak password";
//     }

//     return true;
//   };

//   return { validate, strength };
// };

// // Helper to kill everything
// export const resetValidation = () => {
//   asyncFieldValidator.cancel();
//   if (validationController) validationController.abort();
// };
