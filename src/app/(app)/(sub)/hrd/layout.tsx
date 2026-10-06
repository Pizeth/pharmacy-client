"use client";
import DrawerAppBar from "@/components/Navigations/DrawerAppBar";
import { styled } from "@mui/material/styles";
import { HrdFooter } from "@/components/hrd/HrdFooter";

const backgroundColor = `linear-gradient(
                            135deg,
                            #050057 0%,
                            #0b126f 20%,
                            #14298c 40%,
                            #1a3da7 55%,
                            #162fa0 75%,
                            #0c147d 90%,
                            #080091 100%
                        )`;

const BackgroundRoot = styled("div")(({ theme }) => ({
  display: "contents",
  "--Hrd-page-background": backgroundColor,
  ...theme.applyStyles("dark", {
    "--Hrd-page-background":
      "linear-gradient(135deg, #101720 0%, #172331 40%, #1d2c3d 55%, #172331 75%, #101720 100%)",
  }),
}));
/* Layout UI */
export default function HrdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* Place children where you want to render a page or nested layout */
  // return <DrawerAppBar>{children}</DrawerAppBar>;
  return (
    <BackgroundRoot lang="km">
      <DrawerAppBar
        backgroundColor="var(--Hrd-page-background)"
      >
        {children}
        <HrdFooter />
      </DrawerAppBar>
    </BackgroundRoot>
  );
}
