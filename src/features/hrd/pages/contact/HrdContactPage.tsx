"use client";

import Link from "next/link";
import { Button, Typography } from "@mui/material";
import { Clock3, ExternalLink, Mail, MapPin, Phone, Send } from "lucide-react";
import { HRD_SITE } from "../../data/siteInfo";
import { toGoogleMapsUrl, toTelegramUrl, toTelUrl } from "../../utils/contactLinks";
import type { PublicDocumentsSiteInfo } from "../../types/publicDocuments.types";
import * as S from "./HrdContactPage.styles";

export function HrdContactPage({ site = HRD_SITE }: { site?: PublicDocumentsSiteInfo }) {
  const { contact } = site;
  const mapUrl = contact.address ? toGoogleMapsUrl(contact.address) : null;
  return <S.Root>
    <S.Header><Typography variant="overline" color="text.secondary">Contact Us</Typography><Typography component="h1" variant="h4">ទំនាក់ទំនង</Typography><S.Accent  /><Typography color="text.secondary">{site.name}</Typography></S.Header>
    <S.Layout>
      <S.Location  aria-labelledby="hrd-location-title">
        <S.SectionHeader><MapPin aria-hidden="true" /><Typography id="hrd-location-title" component="h2" variant="h5">ទីតាំងនាយកដ្ឋាន</Typography></S.SectionHeader>
        {contact.address ? <>
          <S.Map  title="ផែនទីទីតាំងនាយកដ្ឋានធនធានមនុស្ស" src={`https://www.google.com/maps?q=${encodeURIComponent(contact.address.text)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          <S.Address><Typography variant="body1">{contact.address.text}</Typography><Button component="a" href={mapUrl!} target="_blank" rel="noopener noreferrer" startIcon={<ExternalLink size={17} />} variant="outlined">បើកក្នុង Google Maps</Button></S.Address>
        </> : <S.Address>ទីតាំងកំពុងរៀបចំ</S.Address>}
      </S.Location>
      <S.Details  aria-labelledby="hrd-contact-title">
        <Typography id="hrd-contact-title" component="h2" variant="h5">ព័ត៌មានទំនាក់ទំនង</Typography>
        <S.Description color="text.secondary">សម្រាប់ព័ត៌មានអំពីឯកសារ និងការទំនាក់ទំនងជាមួយនាយកដ្ឋានធនធានមនុស្ស។</S.Description>
        {contact.phones?.map(phone => {
          const telegram = phone.telegram ? toTelegramUrl(phone.telegram) : null;
          return <S.Line key={phone.number}><Phone size={22} aria-hidden="true" /><div><Typography component="h3" variant="subtitle1">លេខទូរសព្ទ</Typography>{phone.name && <Typography variant="body2" color="text.secondary">{phone.name}</Typography>}<Typography component="a" href={toTelUrl(phone.number)} variant="body1">{phone.number}</Typography>{telegram && <Button component="a" href={telegram} target="_blank" rel="noopener noreferrer" startIcon={<Send size={16} />} size="small">Telegram</Button>}</div></S.Line>;
        })}
        {contact.email && <S.Line><Mail size={22} aria-hidden="true" /><div><Typography component="h3" variant="subtitle1">អ៊ីម៉ែល</Typography><Typography component="a" href={`mailto:${contact.email}`} variant="body1">{contact.email}</Typography></div></S.Line>}
        {contact.hours && <S.Line><Clock3 size={22} aria-hidden="true" /><div><Typography component="h3" variant="subtitle1">ម៉ោងធ្វើការ</Typography><Typography variant="body1">{contact.hours}</Typography></div></S.Line>}
        {!contact.phones?.length && !contact.email && !contact.hours && <Typography color="text.secondary">ព័ត៌មានទំនាក់ទំនងកំពុងរៀបចំ</Typography>}
        <S.Documents><Typography variant="body2">ចង់ស្វែងរកទម្រង់ពាក្យស្នើសុំ?</Typography><Button component={Link} href="/hrd/documents">មើលបណ្ដុំឯកសារ</Button></S.Documents>
      </S.Details>
    </S.Layout>
  </S.Root>;
}
