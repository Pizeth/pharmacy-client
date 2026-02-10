import { useScrollTrigger } from "@mui/material";
import Slide, { SlideProps } from "@mui/material/Slide";

const HideOnScroll = (props: HideOnScrollProps) => {
  const { children, className } = props;
  const trigger = useScrollTrigger({
    threshold: 100,
    disableHysteresis: true,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger} className={className}>
      {children}
    </Slide>
  );
};

export type HideOnScrollProps = Pick<SlideProps, "children" | "className">;

export default HideOnScroll;
