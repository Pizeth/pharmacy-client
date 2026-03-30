import { ParticleProps } from "@/interfaces/component-props.interface";
import Box from "@mui/material/Box";
import { styled, useThemeProps } from "@mui/material/styles";
import Particles from "@tsparticles/react/dist/Particles";

const PREFIX = "RazethParticle";

const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  position: "absolute",
  inset: 0,
  overflow: "hidden",
  pointerEvents: "none",
  zIndex: 0,
}));

const ParticleContainer = (inProps: ParticleProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const { children, id, options, ...rest } = props;
  return (
    <Root {...rest}>
      <Particles id={id} options={options} />
      {children}
    </Root>
  );
};

export default ParticleContainer;
