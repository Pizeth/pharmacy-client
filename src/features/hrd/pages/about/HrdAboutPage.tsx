"use client";

import Link from "next/link";
import Image from "next/image";
import { Button, Typography } from "@mui/material";
import { ArrowRight, Building2, Clock3, Download, GitBranch, UserRound, UsersRound } from "lucide-react";
import { ABOUT_PAGES, HRD_ABOUT_CONTENT, type AboutSection } from "../../data/aboutContent";
import type { HrdAboutContent, PersonProfile } from "../../types/hrdAbout.types";
import * as S from "./HrdAboutPage.styles";
import { DirectorReveal } from "./DirectorReveal";

function Pending({ text = "ព័ត៌មានកំពុងរៀបចំ" }: { text?: string }) {
  return <S.Pending data-pending component="p" variant="body2"><Clock3 size={16} aria-hidden="true" />{text}</S.Pending>;
}

function ContentSection({ title, text, items }: { title: string; text?: string | null; items?: string[] }) {
  return <S.Section>
    <Typography component="h2" variant="h6">{title}</Typography>
    {items?.length ? <S.List>{items.map((item, index) => <Typography component="li" key={`${index}-${item}`} variant="body1">{item}</Typography>)}</S.List>
      : text ? <S.Prose variant="body1">{text}</S.Prose> : <Pending />}
  </S.Section>;
}

function Portrait({ person, large = false }: { person: PersonProfile | null; large?: boolean }) {
  return <S.Portrait data-size={large ? "large" : "normal"}>
    {person?.photo ? <Image src={person.photo} alt={person.name} fill sizes={large ? "240px" : "160px"} /> : <UserRound size={large ? 96 : 64} strokeWidth={1} aria-hidden="true" />}
  </S.Portrait>;
}

export function HrdAboutPage({ section, content = HRD_ABOUT_CONTENT }: { section: AboutSection; content?: HrdAboutContent }) {
  const page = ABOUT_PAGES[section];
  return <S.Root>
    <S.Header>
      <S.Eyebrow variant="overline">{page.english}</S.Eyebrow>
      <Typography component="h1" variant="h4">{page.title}</Typography>
      <S.Accent  />
      <Typography variant="body2" color="text.secondary">នាយកដ្ឋានធនធានមនុស្ស • ក្រសួងមុខងារសាធារណៈ</Typography>
    </S.Header>
    <S.Layout>
      <S.Sidebar>
        <S.NavTitle component="h2" variant="subtitle1">អំពីអង្គភាព</S.NavTitle>
        <S.Navigation aria-label="ទំព័រអំពីអង្គភាព">
          {(Object.entries(ABOUT_PAGES) as [AboutSection, typeof page][]).map(([key, entry]) => <Link key={key} href={`/hrd/about/${key}`} aria-current={section === key ? "page" : undefined}>
            <Typography component="span" variant="body2">{entry.title}</Typography><ArrowRight size={16} aria-hidden="true" />
          </Link>)}
        </S.Navigation>
        <S.Identity><Building2 size={30} aria-hidden="true" /><Typography variant="body2">នាយកដ្ឋានធនធានមនុស្ស</Typography><Typography variant="caption" color="text.secondary">Human Resource Department</Typography></S.Identity>
      </S.Sidebar>
      <S.Panel  aria-label={page.title}>
        {section === "director" && <>
          <S.Profile><DirectorReveal person={content.director} /></S.Profile>
          <ContentSection title="ជីវប្រវត្តិសង្ខេប" text={content.director?.biography} />
          <ContentSection title="ការសិក្សា និងការបណ្តុះបណ្តាល" items={content.director?.education} />
          <ContentSection title="បទពិសោធន៍ការងារ" items={content.director?.experience} />
        </>}
        {section === "overview" && <>
          <S.Introduction><Building2 size={36} aria-hidden="true" /><Typography component="h2" variant="h5">នាយកដ្ឋានធនធានមនុស្ស</Typography><Typography color="text.secondary">ក្រសួងមុខងារសាធារណៈ</Typography></S.Introduction>
          <ContentSection title="ព័ត៌មានសង្ខេប" text={content.overview.history} />
          <ContentSection title="ចក្ខុវិស័យ" text={content.overview.vision} />
          <ContentSection title="បេសកកម្ម" items={content.overview.mission} />
          <ContentSection title="គុណតម្លៃ" text={content.overview.values} />
        </>}
        {section === "structure" && <>
          <Typography component="h2" variant="h5">រចនាសម្ព័ន្ធនាយកដ្ឋានធនធានមនុស្ស</Typography>
          {content.structure.image ? <S.Chart><Image src={content.structure.image} alt="រចនាសម្ព័ន្ធនាយកដ្ឋានធនធានមនុស្ស" width={1200} height={800} sizes="(max-width: 800px) 100vw, 900px" /></S.Chart> : <S.Empty><GitBranch size={64} strokeWidth={1} aria-hidden="true" /><Typography component="h3" variant="h6">គំនូសតាងរចនាសម្ព័ន្ធ</Typography><Pending text="គំនូសតាងផ្លូវការកំពុងរៀបចំ" /></S.Empty>}
          {content.structure.document && <Button component="a" href={content.structure.document} startIcon={<Download size={18} />} variant="outlined">ទាញយករចនាសម្ព័ន្ធ</Button>}
          <ContentSection title="អង្គភាពចំណុះ" items={content.structure.units} />
        </>}
        {section === "staff" && <>
          <Typography component="h2" variant="h5">ថ្នាក់ដឹកនាំ និងមន្រ្តីនាយកដ្ឋាន</Typography>
          {content.staff.some(group => group.people.length) ? content.staff.filter(group => group.people.length).map(group => <S.Section key={group.title}><Typography component="h3" variant="h6">{group.title}</Typography><S.StaffGrid>{group.people.map(person => <S.StaffCard key={`${person.position}-${person.name}`}><Portrait person={person} /><Typography component="h4" variant="subtitle1">{person.name}</Typography><Typography variant="body2" color="text.secondary">{person.position}</Typography></S.StaffCard>)}</S.StaffGrid></S.Section>) : <S.Empty><UsersRound size={64} strokeWidth={1} aria-hidden="true" /><Typography component="h3" variant="h6">បញ្ជីថ្នាក់ដឹកនាំ និងមន្រ្តី</Typography><Pending text="បញ្ជីឈ្មោះ តួនាទី និងរូបថតកំពុងរៀបចំ" /></S.Empty>}
          <Button component={Link} href="/hrd/about/director" endIcon={<ArrowRight size={18} />}>អំពីប្រធាននាយកដ្ឋាន</Button>
        </>}
      </S.Panel>
    </S.Layout>
  </S.Root>;
}
