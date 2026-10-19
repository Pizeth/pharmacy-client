"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { Container, Link, Stack, Typography } from "@mui/material";
import { keyframes, styled } from "@mui/material/styles";
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
import Icons from "@/components/icons/components/socials";

const footerRise = keyframes({
  from: { opacity: 0, transform: "translateY(20px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});
const socialEntrance = keyframes({
  "0%": { opacity: 0, translate: "0 22px", scale: "0.8" },
  "70%": { opacity: 1, translate: "0 -4px", scale: "1.04" },
  "100%": { opacity: 1, translate: "0 0", scale: "1" },
});
const stripeReveal = keyframes({
  from: { transform: "scaleX(0)", opacity: 0 },
  to: { transform: "scaleX(1)", opacity: 1 },
});

/** Replay on viewport re-entry; leave content visible without observer support. */
function useFooterReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === "undefined") return;
    let finish: ReturnType<typeof setTimeout> | undefined;
    let entered = false;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          entered = false;
          clearTimeout(finish);
          setRevealed(false);
        } else if (!entered && entry.intersectionRatio >= 0.08) {
          entered = true;
          setRevealed(true);
          // Release the entrance animation so existing social hover animations win.
          finish = setTimeout(() => setRevealed(false), 1400);
        }
      }
    }, { threshold: [0, 0.08] });
    observer.observe(ref.current);
    return () => { observer.disconnect(); clearTimeout(finish); };
  }, []);
  return { ref, "data-revealed": revealed ? "true" : undefined };
}

const FooterSocials = styled("section", publicDocumentsSlot("FooterSocials"))(({ theme }) => ({
  display: "flex", flexDirection: "column", alignItems: "center", gap: theme.spacing(1.5),
  padding: theme.spacing(1.5, 0),
  borderTop: "4px solid #26247B",
  backgroundColor: (theme.vars ?? theme).palette.background.default,
  "& .MuiIconButton-root": { margin: theme.spacing(0.5) },
  position: "relative",
  "&::before": {
    content: '""', position: "absolute", top: -4, left: 0, right: 0, height: 4,
    background: "linear-gradient(90deg, #26247B, #7774d9, #26247B)",
    pointerEvents: "none", opacity: 0,
  },
  '@media (prefers-reduced-motion: no-preference)': {
    '&[data-revealed="true"]::before': { animation: `${stripeReveal} 850ms ease-out` },
    '&[data-revealed="true"] > .MuiTypography-root': { animation: `${footerRise} 550ms ease-out backwards` },
    '&[data-revealed="true"] > div > *': {
      animation: `${socialEntrance} 650ms cubic-bezier(0.22, 1, 0.36, 1) backwards`,
      ...Object.fromEntries(Array.from({ length: 7 }, (_, i) => [
        `&:nth-child(${i + 1})`, { animationDelay: `${100 + i * 75}ms` },
      ])),
    },
    '&:focus-within > div > *': { animation: "none" },
  },
}));

const FooterRoot = styled(
  "footer",
  publicDocumentsSlot("Footer"),
)(({ theme }) => ({
  // marginTop: theme.spacing(6),
  borderTop: `1px solid ${theme.vars.palette.divider}`,
  backgroundColor: theme.vars.palette.background.paper,
  display: "grid", isolation: "isolate",
  "& > .MuiContainer-root": { gridArea: "1 / 1", minWidth: 0 },
  "&::before": {
    content: '""', gridArea: "1 / 1", zIndex: -1, pointerEvents: "none",
    backgroundColor: "#26247B",
    opacity: 0.15,
    maskImage: 'url("/static/svg/patterns/silhouette.svg?v=normalized")',
    maskSize: "100% auto", maskRepeat: "no-repeat", maskPosition: "center bottom",
  },
  ...theme.applyStyles("dark", {
    "&::before": {
      backgroundImage: "linear-gradient(90deg, #F0C54C, #EDAC4C 50%, #EA9548)",
    },
  }),
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
  '@media (prefers-reduced-motion: no-preference)': {
    '&[data-revealed="true"] > *': { animation: `${footerRise} 650ms ease-out backwards` },
    '&[data-revealed="true"] > :nth-child(2)': { animationDelay: "90ms" },
    '&[data-revealed="true"] > :nth-child(3)': { animationDelay: "180ms" },
    '&:focus-within > *': { animation: "none" },
  },
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

const FooterIdentity = styled("div", publicDocumentsSlot("FooterIdentity"))(({ theme }) => ({
  display: "flex", alignItems: "center", alignSelf: "start", gap: theme.spacing(2),
}));
const FooterLogo = styled(Image, publicDocumentsSlot("FooterLogo"))({
  width: 64, height: 64, objectFit: "contain", flexShrink: 0,
});

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
  textAlign: "center",
  borderTop: "3px solid transparent",
  borderImage: "linear-gradient(90deg, #F0C54C, #EDAC4C 50%, #EA9548) 1",
  backgroundColor: "#26247B",
  color: "#fff",
  position: "relative", isolation: "isolate",
  "&::after": {
    content: '""', position: "absolute", inset: "0 0 0 auto",
    width: "clamp(160px, 32vw, 500px)", maxWidth: "100%",
    pointerEvents: "none", zIndex: -1, opacity: 0.2,
    backgroundColor: "#fff",
    maskImage: 'url("/static/svg/patterns/red-pattern.svg"), linear-gradient(to right, transparent, black 75%)',
    maskSize: "104px 104px, 100% 100%", maskRepeat: "repeat, no-repeat",
    maskPosition: "right center", maskComposite: "intersect",
  },
  ...theme.applyStyles("dark", {
    "&::after": {
      inset: "0 auto 0 0", maskPosition: "left center",
      maskImage: 'url("/static/svg/patterns/red-pattern.svg"), linear-gradient(to left, transparent, black 75%)',
    },
  }),
}));

const Copyright = styled(
  Typography,
  publicDocumentsSlot("Copyright"),
)({ color: "inherit" });

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
  const contentReveal = useFooterReveal<HTMLDivElement>();
  const socialReveal = useFooterReveal<HTMLElement>();

  const contactLines = buildContactLines(site.contact);
  const year = MsgUtils.toLocaleNumerals(new Date().getFullYear(), "km-KH");

  return (
    <FooterRoot>
      <Container maxWidth="xl">
        <FooterGrid {...contentReveal}>
          <FooterIdentity>
            <FooterLogo src="/static/images/logo.svg" alt="" width={64} height={64} />
            <div>
            <FooterHeading variant="subtitle1" gutterBottom>
              {site.name}
            </FooterHeading>
            <FooterTagline variant="body2">{site.tagline}</FooterTagline>
            </div>
          </FooterIdentity>

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
      </Container>
        <FooterSocials {...socialReveal} data-site-footer aria-label="បណ្ដាញសង្គម">
          <Typography variant="subtitle2">បណ្ដាញសង្គម</Typography>
          <Icons />
        </FooterSocials>
        <FooterBottom>
          <Container maxWidth="xl">
          <Copyright variant="caption">
            © ​{year} រក្សាសិទ្ធិគ្រប់យ៉ាងដោយ {site.organization}
          </Copyright>
          </Container>
        </FooterBottom>
    </FooterRoot>
  );
}
