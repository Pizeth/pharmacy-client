"use client";
import { Link } from "@mui/material";
import { safeSocialUrl } from "../api";

export function ProviderWebsite({ url }: { readonly url: string | null }) {
  const href = safeSocialUrl(url);
  return href ? <Link href={href} target="_blank" rel="noopener noreferrer" underline="hover">{url}</Link> : <>{url || "—"}</>;
}
