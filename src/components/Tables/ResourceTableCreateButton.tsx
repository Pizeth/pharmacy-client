"use client";
import { styled } from "@mui/material/styles";
import AddRounded from "@mui/icons-material/AddRounded";
import { visuallyHidden } from "@mui/utils";
import { ResourceActionButton, type ResourceActionButtonProps } from "@/components/buttons";
const Root = styled(ResourceActionButton, {
  name: "RazethTableCreateButton", slot: "Root", overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => {
  const palette = (theme.vars ?? theme).palette;
  const raised = palette.customShadows?.neumorphic ?? "-4px -4px 10px rgb(255 255 255 / 15%), 4px 4px 10px rgb(0 0 0 / 25%)";
  const pressed = palette.customShadows?.inset ?? "inset 3px 3px 7px rgb(0 0 0 / 25%), inset -3px -3px 7px rgb(255 255 255 / 15%)";
  return {
    "&&": {
      borderRadius: 999, color: palette.common.white,
      boxShadow: `${raised}, inset 1px 1px 2px rgb(255 255 255 / 25%)`,
      backgroundImage: "linear-gradient(145deg, rgb(255 255 255 / 12%), rgb(0 0 0 / 8%))",
    },
    "&&:hover, &&:focus-visible": { color: palette.common.white, boxShadow: `${raised}, inset 1px 1px 3px rgb(255 255 255 / 35%)` },
    "&&:active": { boxShadow: pressed },
    "&&.Mui-disabled": { color: palette.common.white, boxShadow: "none" },
    "& .MuiTypography-root, & .MuiButton-startIcon": { color: "inherit" },
    [theme.breakpoints.down("md")]: {
      "&&": { width: 44, height: 44, minWidth: 44, padding: 0, flexShrink: 0 },
      "& > .MuiTypography-root": visuallyHidden,
      "& .MuiButton-startIcon": { margin: 0 },
      "& .MuiButton-endIcon": { display: "none" },
    },
  };
});
/** Universal table Create command. Dialogs and dedicated routes share its action. */
export function ResourceTableCreateButton(props: Omit<ResourceActionButtonProps, "variant">) {
  return <Root startIcon={<AddRounded />} {...props} variant="contained" />;
}
