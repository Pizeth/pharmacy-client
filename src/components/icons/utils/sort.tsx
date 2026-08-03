import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

export default function RazSortable(props: SvgIconProps) {
  return (
    <SvgIcon inheritViewBox {...props}>
      <svg
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        data-testid="SyncAltIcon"
        fill="currentColor"
      >
        <path d="m18 12 4-4-4-4v3H3v2h15zM6 12l-4 4 4 4v-3h15v-2H6z"></path>
      </svg>
    </SvgIcon>
  );
}
