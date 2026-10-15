"use client";

import type { ReactNode } from "react";
import NextLink from "next/link";
import { Container, Link, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import TelegramIcon from "@mui/icons-material/Telegram";

import {
  isExternalUrl,
  toGoogleMapsUrl,
  toTelegramUrl,
  toTelUrl,
} from "../../utils/contactLinks";
import { HRD_SITE } from "../../data/siteInfo";
import { publicDocumentsSlot } from "../../styles/styled";
import type {
  PublicDocumentsPhoneContact,
  PublicDocumentsSiteInfo,
} from "../../types/publicDocuments.types";
import MsgUtils from "@/utils/msgUtils";

const FooterRoot = styled(
  "footer",
  publicDocumentsSlot("Footer"),
)(({ theme }) => ({
  // marginTop: theme.spacing(6),
  borderTop: `1px solid ${theme.vars.palette.divider}`,
  backgroundColor: theme.vars.palette.background.paper,
}));

const IconBubble = styled(
  "span",
  publicDocumentsSlot("IconBubble"),
)(({ theme }) => ({
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

const FooterGrid = styled(
  "div",
  publicDocumentsSlot("FooterGrid"),
)(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(4),
  paddingBlock: theme.spacing(5),
  gridTemplateColumns: "1fr",
  "& > *": { minWidth: 0 },
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 0.65fr) minmax(0, 1fr)",
  },
}));

const QuickLinks = styled("nav", publicDocumentsSlot("FooterQuickLinks"))({
  minWidth: 0,
});

const QuickLinksList = styled("ul", publicDocumentsSlot("FooterQuickLinksList"))(({ theme }) => ({
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "grid",
  gap: theme.spacing(0.5),
  "& a": {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 40,
    color: theme.vars.palette.text.secondary,
    "&:hover": { color: theme.vars.palette.primary.main },
    "&:focus-visible": {
      outline: `2px solid ${theme.vars.palette.primary.main}`,
      outlineOffset: 4,
      borderRadius: 2,
    },
  },
}));

const quickLinks = [
  { href: "/hrd", label: "ទំព័រដើម" },
  { href: "/hrd/about", label: "អំពីនាយកដ្ឋាន" },
  { href: "/hrd/documents", label: "ឯកសារ" },
  { href: "/hrd#hrd-faq", label: "សំណួរដែលសួរញឹកញាប់" },
  { href: "/hrd/contact", label: "ទំនាក់ទំនង" },
] as const;

const FooterHeading = styled(
  Typography,
  publicDocumentsSlot("FooterHeading"),
)({
  fontWeight: 700,
});

const FooterTagline = styled(
  Typography,
  publicDocumentsSlot("FooterTagline"),
)(({ theme }) => ({
  maxWidth: 480,
  color: theme.vars.palette.text.secondary,
}));

const ContactBlock = styled(
  "address",
  publicDocumentsSlot("ContactBlock"),
)({
  fontStyle: "normal",
});

const ContactBody = styled(
  "div",
  publicDocumentsSlot("ContactBody"),
)({
  minWidth: 0,
});

const ContactLabel = styled(
  Typography,
  publicDocumentsSlot("ContactLabel"),
)(({ theme }) => ({
  display: "block",
  color: theme.vars.palette.text.secondary,
}));

const FooterBottom = styled(
  "div",
  publicDocumentsSlot("FooterBottom"),
)(({ theme }) => ({
  paddingBlock: theme.spacing(2.5),
  borderTop: `1px solid ${theme.vars.palette.divider}`,
  textAlign: "center",
}));

const Copyright = styled(
  Typography,
  publicDocumentsSlot("Copyright"),
)(({ theme }) => ({
  color: theme.vars.palette.text.secondary,
}));

interface ContactLine {
  readonly key: string;
  readonly icon: ReactNode;
  readonly label: string;
  readonly content: ReactNode;
}

interface ContactLinkProps {
  readonly href: string;
  readonly title?: string;
  readonly "aria-label"?: string;
  readonly children: ReactNode;
}

/**
 * Footer link. http(s) links open in a new tab; tel: and mailto: links
 * hand off to the dialer / mail app instead.
 */
function ContactLink(props: ContactLinkProps) {
  const { href, children, ...rest } = props;

  return (
    <Link
      href={href}
      color="inherit"
      underline="hover"
      variant="body2"
      {...(isExternalUrl(href)
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      {...rest}
    >
      {children}
    </Link>
  );
}

/**
 * One person on a single line, as two independent links:
 * the name opens Telegram, the number starts a phone call.
 */
function PhoneEntry(props: { readonly phone: PublicDocumentsPhoneContact }) {
  const { phone } = props;

  const telegramUrl = phone.telegram ? toTelegramUrl(phone.telegram) : null;
  const label = phone.name ?? (telegramUrl ? "Telegram" : null);

  const numberLink = (
    <ContactLink href={toTelUrl(phone.number)}>{phone.number}</ContactLink>
  );

  const labelNode = !label ? null : telegramUrl ? (
    <ContactLink
      href={telegramUrl}
      title="Telegram"
      aria-label={`Telegram: ${label}`}
    >
      <Typography variant="body2" component="span">
        {label}
      </Typography>
      <TelegramIcon
        fontSize="inherit"
        aria-hidden
        style={{ marginInlineStart: 4, verticalAlign: "-1px" }}
      />
    </ContactLink>
  ) : (
    label
  );

  return (
    <Typography variant="body2" component="div">
      {labelNode ? (
        <>
          {labelNode} ({numberLink})
        </>
      ) : (
        numberLink
      )}
    </Typography>
  );
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
      content: (
        <ContactLink
          href={toGoogleMapsUrl(contact.address)}
          title="Google Maps"
        >
          {contact.address.text}
        </ContactLink>
      ),
    });
  }

  if (contact.phones && contact.phones.length > 0) {
    lines.push({
      key: "phone",
      icon: <Phone size={16} />,
      label: "លេខទូរសព្ទ",
      content: (
        <Stack spacing={0.5}>
          {contact.phones.map((phone) => (
            <PhoneEntry key={phone.number} phone={phone} />
          ))}
        </Stack>
      ),
    });
  }

  if (contact.email) {
    lines.push({
      key: "email",
      icon: <Mail size={16} />,
      label: "អ៊ីម៉ែល",
      content: (
        <ContactLink href={`mailto:${contact.email}`}>
          {contact.email}
        </ContactLink>
      ),
    });
  }

  if (contact.hours) {
    lines.push({
      key: "hours",
      icon: <Clock size={16} />,
      label: "ម៉ោងធ្វើការ",
      content: <Typography variant="body2">{contact.hours}</Typography>,
    });
  }

  return lines;
}

export interface HrdFooterProps {
  readonly site?: PublicDocumentsSiteInfo;
}

/**
 * Contact information and copyright for the public directory.
 * Content comes from siteInfo.ts.
 */
export function HrdFooter(props: HrdFooterProps) {
  const { site = HRD_SITE } = props;

  const contactLines = buildContactLines(site.contact);
  const year = MsgUtils.toLocaleNumerals(new Date().getFullYear(), "km-KH");

  return (
    <FooterRoot>
      <Container maxWidth="xl">
        <FooterGrid>
          <div>
            <FooterHeading variant="subtitle1" gutterBottom>
              {site.name}
            </FooterHeading>
            <FooterTagline variant="body2">{site.tagline}</FooterTagline>
          </div>

          <QuickLinks aria-labelledby="hrd-footer-quick-links">
            <FooterHeading id="hrd-footer-quick-links" variant="subtitle2" gutterBottom>
              តំណរហ័ស
            </FooterHeading>
            <QuickLinksList>
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link component={NextLink} href={href} underline="hover" variant="body2">
                    {label}
                  </Link>
                </li>
              ))}
            </QuickLinksList>
          </QuickLinks>

          {contactLines.length > 0 && (
            <ContactBlock>
              <FooterHeading variant="subtitle2" gutterBottom>
                ទំនាក់ទំនង
              </FooterHeading>
              <Stack spacing={1.5}>
                {contactLines.map((line) => (
                  <Stack
                    key={line.key}
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >
                    <IconBubble aria-hidden>{line.icon}</IconBubble>
                    <ContactBody>
                      <ContactLabel variant="caption">
                        {line.label}
                      </ContactLabel>
                      {line.content}
                    </ContactBody>
                  </Stack>
                ))}
              </Stack>
            </ContactBlock>
          )}
        </FooterGrid>

        <FooterBottom>
          <Copyright variant="caption">
            © ​{year} រក្សាសិទ្ធិគ្រប់យ៉ាងដោយ {site.organization}
          </Copyright>
        </FooterBottom>
      </Container>
    </FooterRoot>
  );
}
