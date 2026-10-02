"use client";
import DrawerAppBar from "@/components/Navigations/DrawerAppBar";

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
/* Layout UI */
export default function LinkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* Place children where you want to render a page or nested layout */
  // return <DrawerAppBar>{children}</DrawerAppBar>;
  return (
    <DrawerAppBar disabledMenu={true} backgroundColor={backgroundColor}>
      {children}
    </DrawerAppBar>
  );
}
