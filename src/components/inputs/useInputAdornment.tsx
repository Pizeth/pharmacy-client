// // useInputEndAdornment.tsx
// import { ReactNode, useMemo, useState } from "react";
// import {
//   InputAdornment,
//   IconButton,
//   useThemeProps,
//   CircularProgress,
// } from "@mui/material";
// import ClearIcon from "@mui/icons-material/Clear";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { InputAdornmentProps } from "@/interfaces/component-props.interface";
// const PREFIX = "RazethInputEndAdornment";

// export interface InputAdornmentResult {
//   /** The effective <input> type to hand back to the TextField */
//   effectiveType: string;
//   endAdornment?: ReactNode;
// }

// /**
//  * Returns the correct end adornment (spinner / password toggle / clear / icon)
//  * and the effective `type` attribute for the underlying <input>.
//  *
//  * Priority order:
//  *  1. isValidating  → spinner
//  *  2. type === "password"  → show/hide toggle (state lives here)
//  *  3. iconEnd  → static icon
//  *  4. resettable  → clear button
//  */
// export const useInputAdornment = (
//   inProps: InputAdornmentProps,
// ): InputAdornmentResult => {
//   const props = useThemeProps({ props: inProps, name: PREFIX });
//   const {
//     value,
//     type = "text",
//     resettable,
//     clearAlwaysVisible,
//     disabled,
//     readOnly,
//     isValidating,
//     iconEnd,
//     spinnerColor,
//     onClear,
//     ...rest
//   } = props;

//   // `visible` only matters for password fields, but keeping it at the top
//   // level satisfies Rules of Hooks (no conditional hook calls).
//   const [visible, setVisible] = useState(false);

//   const isPassword = type === "password";

//   return useMemo((): InputAdornmentResult => {
//     // ── 1. Validating ──────────────────────────────────────────────────────
//     if (isValidating) {
//       return {
//         effectiveType: isPassword && !visible ? "password" : "text",
//         // ← use it} />
//         endAdornment: (
//           // <CircularProgress size={20} color={spinnerColor ?? "primary"} />
//           <InputAdornment position="end" disablePointerEvents>
//             <CircularProgress size={18} color={spinnerColor ?? "primary"} />
//           </InputAdornment>
//         ),
//       };
//     }

//     // ── 2. Password toggle ─────────────────────────────────────────────────
//     if (isPassword) {
//       return {
//         effectiveType: visible ? "text" : "password",
//         endAdornment: (
//           <InputAdornment position="end" {...rest}>
//             <IconButton
//               aria-label={visible ? "Hide password" : "Show password"}
//               onClick={() => setVisible((p) => !p)}
//               onMouseDown={(e) => e.preventDefault()} // prevent input blur
//               disabled={disabled}
//               size="small"
//               edge="end"
//             >
//               {visible ? <VisibilityOff /> : <Visibility />}
//             </IconButton>
//           </InputAdornment>
//         ),
//       };
//     }

//     // ── 3. Custom end icon ─────────────────────────────────────────────────
//     if (iconEnd) {
//       return {
//         effectiveType: "text",
//         endAdornment: <InputAdornment position="end">{iconEnd}</InputAdornment>,
//       };
//     }

//     // ── 4. Resettable clear button ─────────────────────────────────────────
//     if (resettable) {
//       const hasClearableValue = !!value;
//       return {
//         effectiveType: "text",
//         endAdornment: (
//           <InputAdornment position="end" {...rest}>
//             <IconButton
//               aria-label="Clear input"
//               onClick={onClear}
//               onMouseDown={(e) => e.preventDefault()}
//               disabled={disabled || readOnly || !hasClearableValue}
//               size="small"
//               edge="end"
//             >
//               <ClearIcon
//                 sx={{
//                   opacity: hasClearableValue || clearAlwaysVisible ? 1 : 0,
//                   transition: "opacity 0.2s",
//                   width: "1rem",
//                   height: "1rem",
//                 }}
//               />
//             </IconButton>
//           </InputAdornment>
//         ),
//       };
//     }

//     return { effectiveType: "text" };
//   }, [
//     value,
//     visible,
//     type,
//     isPassword,
//     resettable,
//     clearAlwaysVisible,
//     disabled,
//     readOnly,
//     isValidating,
//     iconEnd,
//     onClear,
//   ]);
// };

// export default useInputAdornment;

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { CircularProgress, IconButton, InputAdornment } from "@mui/material";
import { Clear, Visibility, VisibilityOff } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import type { InputAdornmentProps } from "@/interfaces/component-props.interface";

const PREFIX = "RazethTextField";

const EndAdornmentRoot = styled(InputAdornment, {
  name: PREFIX,
  slot: "Icon",
  overridesResolver: (_props, styles) => styles.icon,
})({});

const ActionButtonRoot = styled(IconButton, {
  name: PREFIX,
  slot: "Button",
  overridesResolver: (_props, styles) => styles.button,
})({});

const ClearIconRoot = styled(Clear, {
  name: PREFIX,
  slot: "Icon",
  overridesResolver: (_props, styles) => styles.icon,
})({
  width: "1rem",
  height: "1rem",
  opacity: 0,
  transition: "opacity 200ms ease",
  '&[data-visible="true"]': {
    opacity: 1,
  },
});

export interface InputAdornmentResult {
  /** The effective <input> type to hand back to the TextField */
  readonly effectiveType: string;
  readonly endAdornment?: ReactNode;
}

/**
 * Standard end-adornment behavior.
 *
 * Returns the correct end adornment (spinner / password toggle / clear / icon)
 * and the effective `type` attribute for the underlying <input>.
 *
 * Priority:
 *
 *  1. isValidating  → spinner
 *  2. type === "password"  → show/hide toggle (state lives here)
 *  3. iconEnd  → static icon
 *  4. resettable  → clear button
 */
export function useInputAdornment(
  props: InputAdornmentProps,
): InputAdornmentResult {
  const {
    value,
    type = "text",
    resettable,
    clearAlwaysVisible,
    disabled,
    readOnly,
    isValidating,
    iconEnd,
    spinnerColor,
    onClear,
    ...rest
  } = props;

  // `visible` only matters for password fields, but keeping it at the top
  // level satisfies Rules of Hooks (no conditional hook calls).
  const [visible, setVisible] = useState(false);

  const isPassword = type === "password";

  return useMemo(() => {
    const effectiveInputType = isPassword
      ? visible
        ? "text"
        : "password"
      : type;

    if (isValidating) {
      return {
        // effectiveType: isPassword && !visible ? "password" : "text",
        effectiveType: effectiveInputType,
        endAdornment: (
          <EndAdornmentRoot position="end" disablePointerEvents>
            <CircularProgress size={18} color={spinnerColor ?? "primary"} />
          </EndAdornmentRoot>
        ),
      };
    }

    if (isPassword) {
      return {
        effectiveType: visible ? "text" : "password",
        endAdornment: (
          <EndAdornmentRoot position="end">
            <ActionButtonRoot
              aria-label={visible ? "Hide password" : "Show password"}
              disabled={disabled}
              size="small"
              edge="end"
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={() => {
                setVisible((current) => !current);
              }}
            >
              {visible ? <VisibilityOff /> : <Visibility />}
            </ActionButtonRoot>
          </EndAdornmentRoot>
        ),
      };
    }

    if (iconEnd) {
      return {
        effectiveType: type,
        endAdornment: (
          <EndAdornmentRoot position="end">{iconEnd}</EndAdornmentRoot>
        ),
      };
    }

    if (resettable) {
      const hasValue = value.length > 0;

      return {
        effectiveType: type,
        endAdornment: (
          <EndAdornmentRoot position="end" {...rest}>
            <ActionButtonRoot
              aria-label="Clear input"
              disabled={disabled || readOnly || !hasValue}
              size="small"
              edge="end"
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={onClear}
            >
              <ClearIconRoot
                data-visible={hasValue || clearAlwaysVisible ? "true" : "false"}
              />
            </ActionButtonRoot>
          </EndAdornmentRoot>
        ),
      };
    }

    return {
      effectiveType: type,
    };
  }, [
    value,
    visible,
    type,
    isPassword,
    resettable,
    clearAlwaysVisible,
    disabled,
    readOnly,
    isValidating,
    iconEnd,
    onClear,
    spinnerColor,
  ]);
}

export default useInputAdornment;

// export const useInputAdornment = (inProps: InputAdornmentProps) => {
//   const props = useThemeProps({ props: inProps, name: PREFIX });
//   const {
//     value,
//     type,
//     isPassword,
//     resettable,
//     clearAlwaysVisible,
//     disabled,
//     readOnly,
//     isValidating,
//     iconEnd,
//     onClear,
//     ...rest
//   } = props;

//   const [visible, setVisible] = useState(false);

//   return useMemo(() => {
//     // 🔥 VALIDATING STATE (highest priority)
//     if (isValidating) {
//       return {
//         type: "text",
//         endAdornment: <CircularProgress size={20} />,
//       };
//     }

//     // 🔥 PASSWORD MODE
//     if (type === "password") {
//       return {
//         type: visible ? "text" : "password",
//         endAdornment: (
//           <InputAdornment position="end">
//             <IconButton
//               onClick={() => setVisible((p) => !p)}
//               disabled={disabled}
//             >
//               {visible ? <VisibilityOff /> : <Visibility />}
//             </IconButton>
//           </InputAdornment>
//         ),
//       };
//     }

//     // 🔥 CUSTOM END ICON
//     if (iconEnd) {
//       return {
//         endAdornment: <InputAdornment position="end">{iconEnd}</InputAdornment>,
//       };
//     }

//     // 🔥 RESETTABLE LOGIC (FULL PARITY)
//     if (!resettable) return {};

//     const showClear = !!value;

//     if (!value && !clearAlwaysVisible) {
//       return {
//         endAdornment: (
//           <InputAdornment position="end">
//             <span style={{ width: 24 }} />
//           </InputAdornment>
//         ),
//       };
//       // return {};
//     }

//     // if (!value) return {};

//     // return {
//     //   endAdornment: (
//     //     <InputAdornment position="end">
//     //       <IconButton onClick={onClear} disabled={disabled}>
//     //         <ClearIcon />
//     //       </IconButton>
//     //     </InputAdornment>
//     //   ),
//     // };
//     return {
//       endAdornment: (
//         <InputAdornment position="end" {...rest}>
//           <IconButton
//             onClick={onClear}
//             disabled={disabled || readOnly || !showClear}
//             size="small"
//           >
//             <ClearIcon
//               style={{
//                 opacity: showClear || clearAlwaysVisible ? 1 : 0,
//                 transition: "0.2s",
//               }}
//             />
//           </IconButton>
//         </InputAdornment>
//       ),
//     };
//   }, [
//     value,
//     visible,
//     isPassword,
//     resettable,
//     clearAlwaysVisible,
//     disabled,
//     readOnly,
//     isValidating,
//     iconEnd,
//     onClear,
//   ]);
// };

// useInputAdornment.tsx
