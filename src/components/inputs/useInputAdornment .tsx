// useInputEndAdornment.tsx
import { useMemo, useState } from "react";
import {
  InputAdornment,
  IconButton,
  useThemeProps,
  CircularProgress,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputAdornmentProps } from "@/interfaces/component-props.interface";
const PREFIX = "RazethInputEndAdornment";
export const useInputAdornment = (inProps: InputAdornmentProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const {
    value,
    type,
    isPassword,
    resettable,
    clearAlwaysVisible,
    disabled,
    readOnly,
    isValidating,
    iconEnd,
    onClear,
    ...rest
  } = props;

  const [visible, setVisible] = useState(false);

  return useMemo(() => {
    // 🔥 VALIDATING STATE (highest priority)
    if (isValidating) {
      return {
        type: "text",
        endAdornment: <CircularProgress size={20} />,
      };
    }

    // 🔥 PASSWORD MODE
    if (type === "password") {
      return {
        type: visible ? "text" : "password",
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setVisible((p) => !p)}
              disabled={disabled}
            >
              {visible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      };
    }

    // 🔥 CUSTOM END ICON
    if (iconEnd) {
      return {
        endAdornment: <InputAdornment position="end">{iconEnd}</InputAdornment>,
      };
    }

    // 🔥 RESETTABLE LOGIC (FULL PARITY)
    if (!resettable) return {};

    const showClear = !!value;

    if (!value && !clearAlwaysVisible) {
      return {
        endAdornment: (
          <InputAdornment position="end">
            <span style={{ width: 24 }} />
          </InputAdornment>
        ),
      };
      // return {};
    }

    // if (!value) return {};

    // return {
    //   endAdornment: (
    //     <InputAdornment position="end">
    //       <IconButton onClick={onClear} disabled={disabled}>
    //         <ClearIcon />
    //       </IconButton>
    //     </InputAdornment>
    //   ),
    // };
    return {
      endAdornment: (
        <InputAdornment position="end" {...rest}>
          <IconButton
            onClick={onClear}
            disabled={disabled || readOnly || !showClear}
            size="small"
          >
            <ClearIcon
              style={{
                opacity: showClear || clearAlwaysVisible ? 1 : 0,
                transition: "0.2s",
              }}
            />
          </IconButton>
        </InputAdornment>
      ),
    };
  }, [
    value,
    visible,
    isPassword,
    resettable,
    clearAlwaysVisible,
    disabled,
    readOnly,
    isValidating,
    iconEnd,
    onClear,
  ]);
};

export default useInputAdornment;
