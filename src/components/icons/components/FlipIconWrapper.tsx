import React from "react";
import { Box, BoxProps, styled } from "@mui/material";

interface FlipIconWrapperProps extends BoxProps {
  children: React.ReactNode;
}

const Root = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transform: "scaleX(-1)",
}));

export function FlipIconWrapper({ children, ...props }: FlipIconWrapperProps) {
  return (
    <Root component="span" {...props}>
      {children}
    </Root>
  );
}

export default FlipIconWrapper;
