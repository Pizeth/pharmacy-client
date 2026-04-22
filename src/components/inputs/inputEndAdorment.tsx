// useInputEndAdornment.tsx
import { useMemo, useState } from "react";
import { InputAdornment, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const useInputEndAdornment = ({
  type,
  value,
  onClear,
  disabled,
}: {
  type?: string;
  value: any;
  onClear?: () => void;
  disabled?: boolean;
}) => {
  const [visible, setVisible] = useState(false);

  return useMemo(() => {
    if (type === "password") {
      return {
        type: visible ? "text" : "password",
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setVisible((p) => !p)}>
              {visible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      };
    }

    if (!value) return {};

    return {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={onClear} disabled={disabled}>
            <ClearIcon />
          </IconButton>
        </InputAdornment>
      ),
    };
  }, [type, value, visible, disabled, onClear]);
};

export default useInputEndAdornment;
