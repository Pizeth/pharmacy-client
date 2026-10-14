"use client";

import Image from "next/image";
import { Button, Typography } from "@mui/material";
import { Clock3, ExternalLink, Facebook, Mail, MapPin, Phone, Send } from "lucide-react";
import { HRD_SITE } from "../../data/siteInfo";
import { toGoogleMapsUrl, toTelegramUrl, toTelUrl } from "../../utils/contactLinks";
import type { PublicDocumentsSiteInfo } from "../../types/publicDocuments.types";
import * as S from "./HrdContactPage.styles";

/**
 * A spokesperson-style identity/contact card, adapted from the visual hierarchy
 * on the Ministry of Interior contact page. Images are local placeholders;
 * never present Otto as an official staff photograph or mint a fake ID number.
 */
export function HrdContactPage({ site = HRD_SITE }: { site?: PublicDocumentsSiteInfo }) {
  const { contact } = site;
  const representative = contact.phones?.find(phone => phone.name) ?? contact.phones?.[0];
  const mapUrl = contact.address ? toGoogleMapsUrl(contact.address) : null;
  const telegram = representative?.telegram ? toTelegramUrl(representative.telegram) : null;
  const hasDetails = Boolean(contact.phones?.length || contact.email || contact.hours);

  return <S.Root>
    <S.Header>
      <Typography variant="overline" color="text.secondary">Contact / Representative</Typography>
      <Typography component="h1" variant="h4">ទំនាក់ទំនង</Typography>
      <S.Accent />
      <Typography variant="body1" color="text.secondary">ព័ត៌មានអ្នកទំនាក់ទំនងនាយកដ្ឋានធនធានមនុស្ស</Typography>
    </S.Header>

    <S.Layout>
      <S.IdCard aria-labelledby="hrd-representative-name">
        <S.CardMasthead>
          <S.Brand>
            <S.BrandLogo>
              <Image src="/static/images/logo.svg" width={64} height={64} alt="" />
            </S.BrandLogo>
            <div>
              <Typography variant="overline">ក្រសួងមុខងារសាធារណៈ</Typography>
              <Typography variant="subtitle1">{site.name}</Typography>
            </div>
          </S.Brand>
          <S.CardType variant="caption">CONTACT CARD</S.CardType>
        </S.CardMasthead>

        <S.Person>
          <S.Portrait>
            <Image src="/static/images/otto.webp" alt="រូបភាពគំរូ Otto — មិនមែនរូបថតមន្រ្តីផ្លូវការ" fill sizes="(max-width: 700px) 130px, 180px" />
          </S.Portrait>
          <S.PersonInfo>
            <Typography variant="overline" color="text.secondary">អ្នកទំនាក់ទំនង / Contact person</Typography>
            <Typography id="hrd-representative-name" component="h2" variant="h5">
              {representative?.name ?? "ឈ្មោះអ្នកទំនាក់ទំនងកំពុងរៀបចំ"}
            </Typography>
            <S.Role>
              <Typography component="span" variant="caption">តួនាទី</Typography>
              <Typography variant="body1">តំណាងទំនាក់ទំនងនាយកដ្ឋាន</Typography>
            </S.Role>
            <S.PlaceholderNote variant="caption">រូបថត និងនិមិត្តសញ្ញាគំរូ — រង់ចាំព័ត៌មានផ្លូវការ</S.PlaceholderNote>
          </S.PersonInfo>
        </S.Person>

        <S.CardDetails>
          <Typography component="h3" variant="subtitle2">ព័ត៌មានសម្រាប់ទាក់ទង</Typography>
          {contact.phones?.map(phone => <S.DetailLine key={phone.number}>
            <Phone size={19} aria-hidden="true" />
            <div>
              <S.DetailLabel variant="caption">{phone.name ? `ទូរសព្ទ • ${phone.name}` : "ទូរសព្ទ"}</S.DetailLabel>
              <Typography component="a" variant="body1" href={toTelUrl(phone.number)}>{phone.number}</Typography>
            </div>
          </S.DetailLine>)}
          {contact.email && <S.DetailLine>
            <Mail size={19} aria-hidden="true" />
            <div>
              <S.DetailLabel variant="caption">អ៊ីម៉ែល</S.DetailLabel>
              <Typography component="a" variant="body1" href={`mailto:${contact.email}`}>{contact.email}</Typography>
            </div>
          </S.DetailLine>}
          {contact.hours && <S.DetailLine>
            <Clock3 size={19} aria-hidden="true" />
            <div><S.DetailLabel variant="caption">ម៉ោងធ្វើការ</S.DetailLabel><Typography variant="body1">{contact.hours}</Typography></div>
          </S.DetailLine>}
          {!hasDetails && <Typography color="text.secondary">ព័ត៌មានទំនាក់ទំនងកំពុងរៀបចំ</Typography>}
        </S.CardDetails>

        <S.SocialActions aria-label="បណ្ដាញទំនាក់ទំនង">
          {telegram && <Button component="a" href={telegram} target="_blank" rel="noopener noreferrer"
            variant="contained" startIcon={<Send size={18} />}>Telegram</Button>}
          <Button disabled variant="outlined" startIcon={<Facebook size={18} />}>
            Facebook (ឆាប់ៗនេះ)
          </Button>
        </S.SocialActions>
      </S.IdCard>

      <S.Location aria-labelledby="hrd-location-title">
        <S.SectionHeader><MapPin size={22} aria-hidden="true" /><Typography id="hrd-location-title" component="h2" variant="h5">ស្វែងរកការិយាល័យ</Typography></S.SectionHeader>
        <Typography variant="body2" color="text.secondary">ទីតាំង និងផ្លូវទៅកាន់នាយកដ្ឋាន</Typography>
        {contact.address ? <>
          <S.Map title="ផែនទីទីតាំងនាយកដ្ឋានធនធានមនុស្ស"
            src={`https://www.google.com/maps?q=${encodeURIComponent(contact.address.text)}&output=embed`}
            loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          <S.Address>
            <Typography variant="body1">{contact.address.text}</Typography>
            {mapUrl && <Button component="a" href={mapUrl} target="_blank" rel="noopener noreferrer"
              startIcon={<ExternalLink size={17} />} variant="outlined">បើកក្នុង Google Maps</Button>}
          </S.Address>
        </> : <S.Address><Typography>ទីតាំងកំពុងរៀបចំ</Typography></S.Address>}
      </S.Location>
    </S.Layout>
  </S.Root>;
}
