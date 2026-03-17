import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

export default function RazX(props: SvgIconProps) {
  return (
    <SvgIcon inheritViewBox {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={14}
        height={14}
        viewBox="0 0 24 24"
      >
        {/* <g fill="none">
          <g clipPath="url(#SVGG1Ot4cAD)">
            <path
              fill="currentColor"
              d="M11.025.656h2.147L8.482 6.03L14 13.344H9.68L6.294 8.909l-3.87 4.435H.275l5.016-5.75L0 .657h4.43L7.486 4.71zm-.755 11.4h1.19L3.78 1.877H2.504z"
            ></path>
          </g>
          <defs>
            <clipPath id="SVGG1Ot4cAD">
              <path fill="#fff" d="M0 0h14v14H0z"></path>
            </clipPath>
          </defs>
        </g> */}
        <path
          fill="currentColor"
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        ></path>
      </svg>
    </SvgIcon>
  );
}
