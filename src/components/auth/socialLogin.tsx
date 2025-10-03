import { Grid } from "@mui/material";
import {
  apple,
  discord,
  github,
  gitlab,
  google,
  linkedin,
  meta,
  microsoft,
  x,
} from "../icons/socialIcons";

const SocialLogin = (
  <Grid container spacing={2}>
    {/* Linkedin */}
    <Grid size={{ xs: 6, sm: 4 }}>{linkedin}</Grid>

    {/* Microsoft */}
    <Grid size={{ xs: 6, sm: 4 }}>{microsoft}</Grid>

    {/* GitLab */}
    <Grid size={{ xs: 6, sm: 4 }}>{gitlab}</Grid>

    {/* GitHub */}
    <Grid size={{ xs: 6, sm: 4 }}>{github}</Grid>

    {/* Google */}
    <Grid size={{ xs: 6, sm: 4 }}>{google}</Grid>

    {/* X (Twitter) */}
    <Grid size={{ xs: 6, sm: 4 }}>{x}</Grid>

    {/* Discord */}
    <Grid size={{ xs: 6, sm: 4 }}>{discord}</Grid>

    {/* Apple */}
    <Grid size={{ xs: 6, sm: 4 }}>{apple}</Grid>

    {/* Meta */}
    <Grid size={{ xs: 6, sm: 4 }}>{meta}</Grid>
  </Grid>
);

export default SocialLogin;
