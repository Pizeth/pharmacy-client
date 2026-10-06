"use client";

import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs, Button, Typography } from "@mui/material";
import { ArrowRight, Building2, Clock3, Download, GitBranch, UserRound, UsersRound } from "lucide-react";
import { ABOUT_PAGES, HRD_ABOUT_CONTENT, type AboutSection, type HrdAboutContent, type PersonProfile } from "./content";
import styles from "./HrdAboutPage.module.css";

function Pending({ text = "ព័ត៌មានកំពុងរៀបចំ" }: { text?: string }) {
  return <Typography component="p" variant="body2" className={styles.pending}><Clock3 size={16} aria-hidden="true" />{text}</Typography>;
}

function ContentSection({ title, text, items }: { title: string; text?: string | null; items?: string[] }) {
  return <section className={styles.section}>
    <Typography component="h2" variant="h6">{title}</Typography>
    {items?.length ? <ol className={styles.list}>{items.map((item, index) => <Typography component="li" key={`${index}-${item}`} variant="body1">{item}</Typography>)}</ol>
      : text ? <Typography variant="body1" className={styles.prose}>{text}</Typography> : <Pending />}
  </section>;
}

function Portrait({ person, large = false }: { person: PersonProfile | null; large?: boolean }) {
  return <div className={large ? styles.largePortrait : styles.portrait}>
    {person?.photo ? <Image src={person.photo} alt={person.name} fill sizes={large ? "240px" : "160px"} /> : <UserRound size={large ? 96 : 64} strokeWidth={1} aria-hidden="true" />}
  </div>;
}

export function HrdAboutPage({ section, content = HRD_ABOUT_CONTENT }: { section: AboutSection; content?: HrdAboutContent }) {
  const page = ABOUT_PAGES[section];
  return <div className={styles.root}>
    <Breadcrumbs aria-label="ទីតាំងទំព័រ" className={styles.breadcrumbs}>
      <Link href="/hrd">ទំព័រដើម</Link><Link href="/hrd/about">អំពីអង្គភាព</Link><Typography variant="body2">{page.title}</Typography>
    </Breadcrumbs>
    <header className={styles.header}>
      <Typography variant="overline" className={styles.eyebrow}>{page.english}</Typography>
      <Typography component="h1" variant="h4">{page.title}</Typography>
      <span className={styles.accent} />
      <Typography variant="body2" color="text.secondary">នាយកដ្ឋានធនធានមនុស្ស • ក្រសួងមុខងារសាធារណៈ</Typography>
    </header>
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <Typography component="h2" variant="subtitle1" className={styles.navTitle}>អំពីអង្គភាព</Typography>
        <nav aria-label="ទំព័រអំពីអង្គភាព" className={styles.navigation}>
          {(Object.entries(ABOUT_PAGES) as [AboutSection, typeof page][]).map(([key, entry]) => <Link key={key} href={`/hrd/about/${key}`} aria-current={section === key ? "page" : undefined}>
            <Typography component="span" variant="body2">{entry.title}</Typography><ArrowRight size={16} aria-hidden="true" />
          </Link>)}
        </nav>
        <div className={styles.identity}><Building2 size={30} aria-hidden="true" /><Typography variant="body2">នាយកដ្ឋានធនធានមនុស្ស</Typography><Typography variant="caption" color="text.secondary">Human Resource Department</Typography></div>
      </aside>
      <article className={styles.panel} aria-label={page.title}>
        {section === "director" && <>
          <div className={styles.profile}><Portrait person={content.director} large />
            <Typography component="h2" variant="h5">{content.director?.name ?? "ប្រធាននាយកដ្ឋានធនធានមនុស្ស"}</Typography>
            {content.director ? <Typography color="text.secondary">{content.director.position}</Typography> : <Pending text="ឈ្មោះ និងរូបថតកំពុងរៀបចំ" />}
          </div>
          <ContentSection title="ជីវប្រវត្តិសង្ខេប" text={content.director?.biography} />
          <ContentSection title="ការសិក្សា និងការបណ្តុះបណ្តាល" items={content.director?.education} />
          <ContentSection title="បទពិសោធន៍ការងារ" items={content.director?.experience} />
        </>}
        {section === "overview" && <>
          <div className={styles.introduction}><Building2 size={36} aria-hidden="true" /><Typography component="h2" variant="h5">នាយកដ្ឋានធនធានមនុស្ស</Typography><Typography color="text.secondary">ក្រសួងមុខងារសាធារណៈ</Typography></div>
          <ContentSection title="ព័ត៌មានសង្ខេប" text={content.overview.history} />
          <ContentSection title="ចក្ខុវិស័យ" text={content.overview.vision} />
          <ContentSection title="បេសកកម្ម" items={content.overview.mission} />
          <ContentSection title="គុណតម្លៃ" text={content.overview.values} />
        </>}
        {section === "structure" && <>
          <Typography component="h2" variant="h5">រចនាសម្ព័ន្ធនាយកដ្ឋានធនធានមនុស្ស</Typography>
          {content.structure.image ? <div className={styles.chart}><Image src={content.structure.image} alt="រចនាសម្ព័ន្ធនាយកដ្ឋានធនធានមនុស្ស" width={1200} height={800} sizes="(max-width: 800px) 100vw, 900px" /></div> : <div className={styles.empty}><GitBranch size={64} strokeWidth={1} aria-hidden="true" /><Typography component="h3" variant="h6">គំនូសតាងរចនាសម្ព័ន្ធ</Typography><Pending text="គំនូសតាងផ្លូវការកំពុងរៀបចំ" /></div>}
          {content.structure.document && <Button component="a" href={content.structure.document} startIcon={<Download size={18} />} variant="outlined">ទាញយករចនាសម្ព័ន្ធ</Button>}
          <ContentSection title="អង្គភាពចំណុះ" items={content.structure.units} />
        </>}
        {section === "staff" && <>
          <Typography component="h2" variant="h5">ថ្នាក់ដឹកនាំ និងមន្រ្តីនាយកដ្ឋាន</Typography>
          {content.staff.some(group => group.people.length) ? content.staff.filter(group => group.people.length).map(group => <section key={group.title} className={styles.section}><Typography component="h3" variant="h6">{group.title}</Typography><div className={styles.staffGrid}>{group.people.map(person => <div key={`${person.position}-${person.name}`} className={styles.staffCard}><Portrait person={person} /><Typography component="h4" variant="subtitle1">{person.name}</Typography><Typography variant="body2" color="text.secondary">{person.position}</Typography></div>)}</div></section>) : <div className={styles.empty}><UsersRound size={64} strokeWidth={1} aria-hidden="true" /><Typography component="h3" variant="h6">បញ្ជីថ្នាក់ដឹកនាំ និងមន្រ្តី</Typography><Pending text="បញ្ជីឈ្មោះ តួនាទី និងរូបថតកំពុងរៀបចំ" /></div>}
          <Button component={Link} href="/hrd/about/director" endIcon={<ArrowRight size={18} />}>អំពីប្រធាននាយកដ្ឋាន</Button>
        </>}
      </article>
    </div>
  </div>;
}
