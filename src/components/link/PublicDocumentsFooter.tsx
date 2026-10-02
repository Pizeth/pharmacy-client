"use client";

// // src/components/link/PublicDocumentsFooter.tsx

// import type { ReactNode } from "react";
// import { Box, Container, Link, Stack, Typography, styled } from "@mui/material";
// import { Clock, Mail, MapPin, Phone } from "lucide-react";
// import TelegramIcon from "@mui/icons-material/Telegram";

// import {
//   isExternalUrl,
//   toGoogleMapsUrl,
//   toTelegramUrl,
//   toTelUrl,
// } from "./contactLinks";
// import { PUBLIC_DOCUMENTS_SITE } from "./siteInfo";
// import type {
//   PublicDocumentsPhoneContact,
//   PublicDocumentsSiteInfo,
// } from "./types";
// import MsgUtils from "@/utils/msgUtils";

// const FooterRoot = styled("footer")(({ theme }) => ({
//   // marginTop: theme.spacing(6),
//   borderTop: `1px solid ${theme.vars.palette.divider}`,
//   backgroundColor: theme.vars.palette.background.paper,
// }));

// const IconBubble = styled("span")(({ theme }) => ({
//   display: "inline-flex",
//   alignItems: "center",
//   justifyContent: "center",
//   flexShrink: 0,
//   width: 32,
//   height: 32,
//   borderRadius: "50%",
//   color: theme.vars.palette.primary.main,
//   backgroundColor: theme.vars.palette.background.paper,
//   boxShadow: theme.vars.palette.customShadows.circleWell,
// }));

// interface ContactLine {
//   readonly key: string;
//   readonly icon: ReactNode;
//   readonly label: string;
//   readonly content: ReactNode;
// }

// interface ContactLinkProps {
//   readonly href: string;
//   readonly title?: string;
//   readonly "aria-label"?: string;
//   readonly children: ReactNode;
// }

// /**
//  * Footer link. http(s) links open in a new tab; tel: and mailto: links
//  * hand off to the dialer / mail app instead.
//  */
// function ContactLink(props: ContactLinkProps) {
//   const { href, children, ...rest } = props;

//   return (
//     <Link
//       href={href}
//       color="inherit"
//       underline="hover"
//       variant="body2"
//       {...(isExternalUrl(href)
//         ? { target: "_blank", rel: "noopener noreferrer" }
//         : {})}
//       {...rest}
//     >
//       {children}
//     </Link>
//   );
// }

// /**
//  * One person on a single line, as two independent links:
//  * the name opens Telegram, the number starts a phone call.
//  */
// function PhoneEntry(props: { readonly phone: PublicDocumentsPhoneContact }) {
//   const { phone } = props;

//   const telegramUrl = phone.telegram ? toTelegramUrl(phone.telegram) : null;
//   const label = phone.name ?? (telegramUrl ? "Telegram" : null);

//   const numberLink = (
//     <ContactLink href={toTelUrl(phone.number)}>{phone.number}</ContactLink>
//   );

//   const labelNode = !label ? null : telegramUrl ? (
//     <ContactLink
//       href={telegramUrl}
//       title="Telegram"
//       aria-label={`Telegram: ${label}`}
//     >
//       <Typography variant="body2" component="span">
//         {label}
//       </Typography>
//       <TelegramIcon
//         fontSize="inherit"
//         aria-hidden
//         style={{ marginInlineStart: 4, verticalAlign: "-1px" }}
//       />
//     </ContactLink>
//   ) : (
//     label
//   );

//   return (
//     <Typography variant="body2" component="div">
//       {labelNode ? (
//         <>
//           {labelNode} ({numberLink})
//         </>
//       ) : (
//         numberLink
//       )}
//     </Typography>
//   );
// }

// function buildContactLines(
//   contact: PublicDocumentsSiteInfo["contact"],
// ): ContactLine[] {
//   const lines: ContactLine[] = [];

//   if (contact.address) {
//     lines.push({
//       key: "address",
//       icon: <MapPin size={16} />,
//       label: "អាសយដ្ឋាន",
//       content: (
//         <ContactLink
//           href={toGoogleMapsUrl(contact.address)}
//           title="Google Maps"
//         >
//           {contact.address.text}
//         </ContactLink>
//       ),
//     });
//   }

//   if (contact.phones && contact.phones.length > 0) {
//     lines.push({
//       key: "phone",
//       icon: <Phone size={16} />,
//       label: "លេខទូរសព្ទ",
//       content: (
//         <Stack spacing={0.5}>
//           {contact.phones.map((phone) => (
//             <PhoneEntry key={phone.number} phone={phone} />
//           ))}
//         </Stack>
//       ),
//     });
//   }

//   if (contact.email) {
//     lines.push({
//       key: "email",
//       icon: <Mail size={16} />,
//       label: "អ៊ីម៉ែល",
//       content: (
//         <ContactLink href={`mailto:${contact.email}`}>
//           {contact.email}
//         </ContactLink>
//       ),
//     });
//   }

//   if (contact.hours) {
//     lines.push({
//       key: "hours",
//       icon: <Clock size={16} />,
//       label: "ម៉ោងធ្វើការ",
//       content: <Typography variant="body2">{contact.hours}</Typography>,
//     });
//   }

//   return lines;
// }

// export interface PublicDocumentsFooterProps {
//   readonly site?: PublicDocumentsSiteInfo;
// }

// /**
//  * Contact information and copyright for the public directory.
//  * Content comes from siteInfo.ts.
//  */
// export function PublicDocumentsFooter(props: PublicDocumentsFooterProps) {
//   const { site = PUBLIC_DOCUMENTS_SITE } = props;

//   const contactLines = buildContactLines(site.contact);
//   const year = MsgUtils.toLocaleNumerals(new Date().getFullYear(), "km-KH");

//   return (
//     <FooterRoot>
//       <Container maxWidth="xl">
//         <Box
//           sx={{
//             display: "grid",
//             gap: 4,
//             py: 5,
//             gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
//           }}
//         >
//           <Box>
//             <Typography variant="subtitle1" fontWeight={700} gutterBottom>
//               {site.name}
//             </Typography>
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{ maxWidth: 480 }}
//             >
//               {site.tagline}
//             </Typography>
//           </Box>

//           {contactLines.length > 0 && (
//             <Box component="address" sx={{ fontStyle: "normal" }}>
//               <Typography variant="subtitle2" fontWeight={700} gutterBottom>
//                 ទំនាក់ទំនង
//               </Typography>
//               <Stack spacing={1.5}>
//                 {contactLines.map((line) => (
//                   <Stack
//                     key={line.key}
//                     direction="row"
//                     spacing={1.5}
//                     alignItems="center"
//                   >
//                     <IconBubble aria-hidden>{line.icon}</IconBubble>
//                     <Box sx={{ minWidth: 0 }}>
//                       <Typography
//                         variant="caption"
//                         color="text.secondary"
//                         display="block"
//                       >
//                         {line.label}
//                       </Typography>
//                       {line.content}
//                     </Box>
//                   </Stack>
//                 ))}
//               </Stack>
//             </Box>
//           )}
//         </Box>

//         <Box
//           sx={{
//             py: 2.5,
//             borderTop: (theme) => `1px solid ${theme.vars.palette.divider}`,
//             textAlign: { xs: "center", md: "start" },
//           }}
//         >
//           <Typography variant="caption" color="text.secondary">
//             © ​{year} រក្សាសិទ្ធិគ្រប់យ៉ាងដោយ {site.organization}
//           </Typography>
//         </Box>
//       </Container>
//     </FooterRoot>
//   );
// }

// src/components/link/PublicDocumentsFooter.tsx

import type { ReactNode } from "react";
import { Container, Link, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import TelegramIcon from "@mui/icons-material/Telegram";

import {
  isExternalUrl,
  toGoogleMapsUrl,
  toTelegramUrl,
  toTelUrl,
} from "./contactLinks";
import { PUBLIC_DOCUMENTS_SITE } from "./siteInfo";
import { publicDocumentsSlot } from "./styled";
import type {
  PublicDocumentsPhoneContact,
  PublicDocumentsSiteInfo,
} from "./types";
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
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "1.2fr 1fr",
  },
}));

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
  [theme.breakpoints.up("md")]: {
    textAlign: "start",
  },
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
        <FooterGrid>
          <div>
            <FooterHeading variant="subtitle1" gutterBottom>
              {site.name}
            </FooterHeading>
            <FooterTagline variant="body2">{site.tagline}</FooterTagline>
          </div>

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
