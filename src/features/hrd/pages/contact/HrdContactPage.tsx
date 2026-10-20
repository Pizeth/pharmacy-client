"use client";

import { Button, Typography } from "@mui/material";
import { Mail, Phone, MapPin, ExternalLink, Clock3, BriefcaseBusiness } from "lucide-react";
import SocialButton from "@/components/icons/components/socialButton";
import Meta from "@/components/icons/socials/meta";
import Telegram from "@/components/icons/socials/telegram";
import { HRD_SITE } from "../../data/siteInfo";
import { toGoogleMapsUrl, toTelegramUrl, toTelUrl } from "../../utils/contactLinks";
import type { PublicDocumentsSiteInfo } from "../../types/publicDocuments.types";
import * as S from "./HrdContactPage.styles";
import { ContactCardArtwork } from "./ContactCardArtwork";
import { ContactForm } from "./ContactForm";
import { ContactCarousel } from "./ContactCarousel";
import { ContactMap } from "./ContactMap";

export function HrdContactPage({ site = HRD_SITE }: { site?: PublicDocumentsSiteInfo }) {
  return (
    <S.Root>
      <ContactCarousel />
      <S.PageGrid>
      <S.Details>
      <S.Layout aria-labelledby="hrd-contact-information-title">
        <Typography id="hrd-contact-information-title" component="h2" variant="h5">ព័ត៌មានទំនាក់ទំនង</Typography>
        {site.contact.phones?.map((person, index) => {
          const telegram = person.telegram ? toTelegramUrl(person.telegram) : null;
          const nameId = `hrd-contact-person-${index}`;
          return (
            <S.Card key={person.number} aria-labelledby={nameId}>
              <ContactCardArtwork />
              <S.CardHeader>
                <S.HeaderPattern aria-hidden="true" />
                <S.Logo src="/static/images/logo.svg" width={64} height={64} alt="" />
                <Typography component="h2" variant="subtitle1">{site.name}</Typography>
              </S.CardHeader>
              <S.CardBody>
                <S.Portrait src={person.portrait ?? "/static/images/otto.webp"} width={144} height={166} alt={person.portrait ? `រូបថត ${person.name ?? "ព័ត៌មានទំនាក់ទំនង"}` : "Otto — រូបភាពបណ្ដោះអាសន្ន"} />
                <S.Copy>
                  <Typography id={nameId} component="h3" variant="subtitle1">{person.name ?? "ព័ត៌មានទំនាក់ទំនង"}</Typography>
                  <S.Role><BriefcaseBusiness size={18} role="img" aria-label="តួនាទី" /><Typography component="span" variant="body2">{person.role ?? "—"}</Typography></S.Role>
                  {site.contact.email && <S.ContactRow><Mail size={18} aria-hidden="true" /><S.ContactLink href={`mailto:${site.contact.email}`}>{site.contact.email}</S.ContactLink></S.ContactRow>}
                  <S.ContactRow><Phone size={18} aria-hidden="true" /><S.ContactLink href={toTelUrl(person.number)}>{person.number}</S.ContactLink></S.ContactRow>
                  <S.Socials>
                    <SocialButton buttonType="iconButton" className="meta" label="Meta — Facebook link coming soon" icon={<Meta />} placeholder />
                    {telegram && <SocialButton buttonType="iconButton" className="telegram" label="Telegram" icon={<Telegram />} href={telegram} />}
                  </S.Socials>
                </S.Copy>
              </S.CardBody>
              <S.Hours>
                {site.contact.hours && <div><Clock3 size={12} role="img" aria-label="ម៉ោងធ្វើការ" /><Typography variant="caption">{site.contact.hours}</Typography></div>}
                {site.contact.address?.street && <div><MapPin size={12} aria-hidden="true" /><Typography variant="caption">{site.contact.address.street}</Typography></div>}
              </S.Hours>
            </S.Card>
          );
        })}
        {!site.contact.phones?.length && <Typography color="text.secondary">ព័ត៌មានទំនាក់ទំនងកំពុងរៀបចំ</Typography>}
      </S.Layout>
      </S.Details>
      <ContactForm email={site.contact.email} />
      </S.PageGrid>
      <S.Location aria-labelledby="hrd-location-title">
        <S.SectionHeader><MapPin aria-hidden="true" /><Typography id="hrd-location-title" component="h2" variant="h5">ទីតាំងនាយកដ្ឋាន</Typography></S.SectionHeader>
        {site.contact.address ? <>
          <ContactMap address={site.contact.address} name={site.name} />
          <S.Address><Typography>{site.contact.address.text}</Typography><Button component="a" href={toGoogleMapsUrl(site.contact.address)} target="_blank" rel="noopener noreferrer" startIcon={<ExternalLink size={17} />} variant="outlined">បើកក្នុង Google Maps</Button></S.Address>
        </> : <S.Address>ទីតាំងកំពុងរៀបចំ</S.Address>}
      </S.Location>
    </S.Root>
  );
}
