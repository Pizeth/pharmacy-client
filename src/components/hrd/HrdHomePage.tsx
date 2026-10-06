"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { ArrowLeft, ArrowRight, FileText, FolderOpen, Mail, Users } from "lucide-react";
import { PUBLIC_DOCUMENTS } from "./data";
import { HRD_SITE } from "./siteInfo";
import styles from "./HrdHomePage.module.css";

const highlights = [
  {
    eyebrow: "នាយកដ្ឋានធនធានមនុស្ស",
    title: "រួមគ្នាអភិវឌ្ឍធនធានមនុស្ស សម្រាប់សេវាសាធារណៈប្រកបដោយគុណភាព",
    description: "សូមស្វាគមន៍មកកាន់គេហទំព័រនាយកដ្ឋានធនធានមនុស្ស នៃក្រសួងមុខងារសាធារណៈ។",
    action: "ស្វែងរកឯកសារ",
  },
  {
    eyebrow: "បណ្ដុំឯកសារ",
    title: "ទម្រង់ពាក្យស្នើសុំ និងឯកសារសម្រាប់មន្រ្តីរាជការស៊ីវិល",
    description: "ស្វែងរកទម្រង់ពាក្យស្នើសុំច្បាប់ឈប់សម្រាក វិញ្ញាបនបត្រ និងឯកសារពាក់ព័ន្ធនៅកន្លែងតែមួយ។",
    action: "មើលបណ្ដុំឯកសារ",
  },
  {
    eyebrow: "ងាយស្រួលស្វែងរក និងទាញយក",
    title: "ចូលប្រើប្រាស់ឯកសារតាមតម្រូវការរបស់អ្នក",
    description: "ប្រើការស្វែងរក និងជ្រើសរើសប្រភេទឯកសារ ដើម្បីរកទម្រង់ពាក្យដែលអ្នកត្រូវការ។",
    action: "ទាញយកទម្រង់ពាក្យ",
  },
] as const;

const featuredDocuments = PUBLIC_DOCUMENTS.slice(0, 3);
const resources = PUBLIC_DOCUMENTS.slice(3, 7);

export function HrdHomePage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = highlights[slideIndex];
  const changeSlide = (step: number) =>
    setSlideIndex((current) => (current + step + highlights.length) % highlights.length);

  return (
    <Box className={styles.root}>
      <header className={styles.identity}>
        <div>
          <Typography variant="overline" className={styles.kicker}>ក្រសួងមុខងារសាធារណៈ</Typography>
          <Typography component="h1" variant="h4">នាយកដ្ឋានធនធានមនុស្ស</Typography>
        </div>
        <Typography variant="body2" className={styles.english}>HUMAN RESOURCE DEPARTMENT</Typography>
      </header>

      <section className={styles.feature} aria-label="ព័ត៌មានសំខាន់" aria-roledescription="carousel">
        <div className={styles.featureVisual}>
          <Image src="/static/images/hrd-office.svg" alt="" fill sizes="(max-width: 700px) 100vw, 50vw" preload />
          <div className={styles.visualCaption}>
            <span className={styles.goldLine} />
            <Typography variant="body2">មនុស្ស • សមត្ថភាព • គុណភាព</Typography>
          </div>
        </div>
        <div className={styles.featureCopy} aria-live="polite" aria-atomic="true">
          <Typography variant="overline" className={styles.featureEyebrow}>{slide.eyebrow}</Typography>
          <Typography component="h2" variant="h4" className={styles.featureTitle}>{slide.title}</Typography>
          <Typography variant="body1" className={styles.featureDescription}>{slide.description}</Typography>
          <Button component={Link} href="/hrd/documents" className={styles.heroButton} endIcon={<ArrowRight size={18} />}>
            {slide.action}
          </Button>
        </div>
        <IconButton className={`${styles.carouselArrow} ${styles.previous}`} aria-label="ព័ត៌មានមុន" onClick={() => changeSlide(-1)}>
          <ArrowLeft size={20} />
        </IconButton>
        <IconButton className={`${styles.carouselArrow} ${styles.next}`} aria-label="ព័ត៌មានបន្ទាប់" onClick={() => changeSlide(1)}>
          <ArrowRight size={20} />
        </IconButton>
      </section>
      <div className={styles.pagination} aria-label="ជ្រើសរើសព័ត៌មាន">
        {highlights.map((highlight, index) => (
          <button key={highlight.eyebrow} type="button" className={styles.dot} aria-label={`ព័ត៌មាន ${index + 1}`}
            aria-pressed={slideIndex === index} onClick={() => setSlideIndex(index)} />
        ))}
      </div>

      <section className={styles.section} aria-labelledby="hrd-documents-heading">
        <div className={styles.sectionHeading}>
          <Typography component="h2" variant="h4" id="hrd-documents-heading">ឯកសារសំខាន់ៗ</Typography>
          <Button component={Link} href="/hrd/documents" endIcon={<ArrowRight size={17} />}>មើលទាំងអស់</Button>
        </div>
        <div className={styles.documentGrid}>
          {featuredDocuments.map((document, index) => (
            <Link href="/hrd/documents" key={document.id} className={styles.documentCard}>
              <div className={`${styles.documentCover} ${styles[`cover${index}`]}`}>
                <Typography variant="caption">នាយកដ្ឋានធនធានមនុស្ស</Typography>
                <FileText size={48} strokeWidth={1} aria-hidden="true" />
                <Typography component="span" variant="h6">ទម្រង់ពាក្យស្នើសុំ</Typography>
                <Typography variant="caption">{document.fileTypes.join(" / ")}</Typography>
              </div>
              <div className={styles.cardCopy}>
                <Typography variant="caption" className={styles.category}>{document.category}</Typography>
                <Typography component="h3" variant="subtitle1" fontWeight={700}>{document.title}</Typography>
                <Typography variant="body2" className={styles.secondary}>{document.description}</Typography>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.welcome} aria-labelledby="hrd-welcome-heading">
        <div className={styles.welcomeSymbol}><Users size={68} strokeWidth={1} aria-hidden="true" />
          <Typography variant="overline">HUMAN RESOURCE DEPARTMENT</Typography>
        </div>
        <div className={styles.welcomeCopy}>
          <Typography variant="overline" className={styles.category}>សូមស្វាគមន៍</Typography>
          <Typography component="h2" variant="h4" id="hrd-welcome-heading">ស្វាគមន៍មកកាន់នាយកដ្ឋានធនធានមនុស្ស</Typography>
          <Typography variant="body1">គេហទំព័រនេះប្រមូលផ្ដុំទម្រង់ពាក្យស្នើសុំ និងឯកសារពាក់ព័ន្ធ ដើម្បីជួយមន្រ្តីរាជការស៊ីវិលស្វែងរក និងទាញយកឯកសារបានកាន់តែងាយស្រួល។</Typography>
          <Typography variant="body1">អ្នកអាចចូលទៅកាន់បណ្ដុំឯកសារ ឬទាក់ទងមកនាយកដ្ឋានតាមព័ត៌មានទំនាក់ទំនងខាងក្រោម។</Typography>
          <Button component={Link} href="/hrd/documents" endIcon={<ArrowRight size={18} />}>ចូលទៅបណ្ដុំឯកសារ</Button>
        </div>
      </section>

      <section className={styles.quickLinks} aria-label="តំណភ្ជាប់រហ័ស">
        <Link href="/hrd/documents"><FolderOpen aria-hidden="true" /><Typography variant="subtitle1" fontWeight={700}>បណ្ដុំឯកសារ</Typography><ArrowRight size={18} /></Link>
        <a href="#hrd-resources"><FileText aria-hidden="true" /><Typography variant="subtitle1" fontWeight={700}>ទម្រង់ពាក្យស្នើសុំ</Typography><ArrowRight size={18} /></a>
        <a href="#hrd-contact"><Mail aria-hidden="true" /><Typography variant="subtitle1" fontWeight={700}>ទំនាក់ទំនង</Typography><ArrowRight size={18} /></a>
      </section>

      <section className={styles.section} id="hrd-resources" aria-labelledby="hrd-resources-heading">
        <div className={styles.sectionHeading}>
          <Typography component="h2" variant="h4" id="hrd-resources-heading">ទម្រង់ពាក្យសម្រាប់មន្រ្តីរាជការ</Typography>
          <Button component={Link} href="/hrd/documents" endIcon={<ArrowRight size={17} />}>ឯកសារទាំងអស់</Button>
        </div>
        <div className={styles.resourceGrid}>
          {resources.map((document) => (
            <Link key={document.id} href="/hrd/documents" className={styles.resourceCard}>
              <FileText size={28} strokeWidth={1.5} aria-hidden="true" />
              <Typography component="h3" variant="subtitle1" fontWeight={700}>{document.title}</Typography>
              <Typography variant="caption" className={styles.secondary}>{document.fileTypes.join(" · ")} / {document.fileSize}</Typography>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.contact} id="hrd-contact" aria-labelledby="hrd-contact-heading">
        <div>
          <Typography component="h2" variant="h5" id="hrd-contact-heading">ត្រូវការព័ត៌មានបន្ថែម?</Typography>
          <Typography variant="body1">សូមទាក់ទងនាយកដ្ឋានធនធានមនុស្ស</Typography>
        </div>
        {HRD_SITE.contact.email && (
          <Button component="a" href={`mailto:${HRD_SITE.contact.email}`} variant="outlined" startIcon={<Mail size={18} />}>ទំនាក់ទំនងតាមអ៊ីមែល</Button>
        )}
      </section>
    </Box>
  );
}
