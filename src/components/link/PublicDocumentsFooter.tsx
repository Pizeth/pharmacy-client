"use client";

// src/components/link/PublicDocumentsFooter.tsx

import type { ReactNode } from "react";
import { Box, Container, Link, Stack, Typography, styled } from "@mui/material";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { PUBLIC_DOCUMENTS_SITE } from "./siteInfo";
import type { PublicDocumentsSiteInfo } from "./types";
import MsgUtils from "@/utils/msgUtils";

const FooterRoot = styled("footer")(({ theme }) => ({
  // marginTop: theme.spacing(6),
  borderTop: `1px solid ${theme.vars.palette.divider}`,
  backgroundColor: theme.vars.palette.background.paper,
}));

const IconBubble = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: 32,
  height: 32,
  borderRadius: "50%",
  color: theme.vars.palette.primary.main,
  backgroundColor: theme.vars.palette.background.paper,
  boxShadow: theme.vars.palette.customShadows.circleWell,
}));

interface ContactLine {
  readonly key: string;
  readonly icon: ReactNode;
  readonly label: string;
  readonly text: string;
  readonly href?: string;
}

function buildContactLines(
  contact: PublicDocumentsSiteInfo["contact"],
): ContactLine[] {
  const lines: ContactLine[] = [];

  if (contact.address) {
    lines.push({
      key: "address",
      icon: <MapPin size={16} />,
      label: "អាសយដ្ឋាន",
      text: contact.address,
    });
  }

  if (contact.phone) {
    lines.push({
      key: "phone",
      icon: <Phone size={16} />,
      label: "លេខទូរសព្ទ",
      text: "លោកស្រី សន ម៉ាលី (" + contact.phone + ")",
      href: `tel:${contact.phone.replace(/[^\d+]/g, "")}`,
    });
  }

  if (contact.email) {
    lines.push({
      key: "email",
      icon: <Mail size={16} />,
      label: "អ៊ីម៉ែល",
      text: contact.email,
      href: `mailto:${contact.email}`,
    });
  }

  if (contact.hours) {
    lines.push({
      key: "hours",
      icon: <Clock size={16} />,
      label: "ម៉ោងធ្វើការ",
      text: contact.hours,
    });
  }

  return lines;
}

export interface PublicDocumentsFooterProps {
  readonly site?: PublicDocumentsSiteInfo;
}

/**
 * Contact information and copyright for the public directory.
 * Content comes from siteInfo.ts.
 */
export function PublicDocumentsFooter(props: PublicDocumentsFooterProps) {
  const { site = PUBLIC_DOCUMENTS_SITE } = props;

  const contactLines = buildContactLines(site.contact);
  const year = MsgUtils.toLocaleNumerals(new Date().getFullYear(), "km-KH");

  return (
    <FooterRoot>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gap: 4,
            py: 5,
            gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              {site.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 480 }}
            >
              {site.tagline}
            </Typography>
          </Box>

          {contactLines.length > 0 && (
            <Box component="address" sx={{ fontStyle: "normal" }}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                ទំនាក់ទំនង
              </Typography>
              <Stack spacing={1.5}>
                {contactLines.map((line) => (
                  <Stack
                    key={line.key}
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >
                    <IconBubble aria-hidden>{line.icon}</IconBubble>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        {line.label}
                      </Typography>
                      {line.href ? (
                        <Link
                          href={line.href}
                          color="inherit"
                          underline="hover"
                          variant="body2"
                        >
                          {line.text}
                        </Link>
                      ) : (
                        <Typography variant="body2">{line.text}</Typography>
                      )}
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            py: 2.5,
            borderTop: (theme) => `1px solid ${theme.vars.palette.divider}`,
            textAlign: { xs: "center", md: "start" },
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © ​{year} រក្សាសិទ្ធិគ្រប់យ៉ាងដោយ {site.organization}
          </Typography>
        </Box>
      </Container>
    </FooterRoot>
  );
}
