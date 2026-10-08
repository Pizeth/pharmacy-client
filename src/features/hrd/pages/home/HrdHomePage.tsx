"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Typography } from "@mui/material";
import { ArrowLeft, ArrowRight, FileText, FolderOpen, Mail, Users } from "lucide-react";
import { PUBLIC_DOCUMENTS } from "../../documents/data/publicDocuments";
import { HRD_HOME_HIGHLIGHTS } from "../../data/homeHighlights";
import { HRD_SITE } from "../../data/siteInfo";
import * as S from "./HrdHomePage.styles";
import { useHomeScrollReveal } from "./useHomeScrollReveal";

const featuredDocuments = PUBLIC_DOCUMENTS.slice(0, 3);
const resources = PUBLIC_DOCUMENTS.slice(3, 7);

export function HrdHomePage() {
  const reveal = useHomeScrollReveal();
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = HRD_HOME_HIGHLIGHTS[slideIndex];
  const changeSlide = (step: number) =>
    setSlideIndex((current) => (current + step + HRD_HOME_HIGHLIGHTS.length) % HRD_HOME_HIGHLIGHTS.length);

  return (
    <S.Root>
      <S.Identity>
        <div>
          <S.Kicker variant="overline">ក្រសួងមុខងារសាធារណៈ</S.Kicker>
          <Typography component="h1" variant="h4">នាយកដ្ឋានធនធានមនុស្ស</Typography>
        </div>
        <S.English variant="body2">HUMAN RESOURCE DEPARTMENT</S.English>
      </S.Identity>

      <S.Feature  aria-label="ព័ត៌មានសំខាន់" aria-roledescription="carousel">
        <S.FeatureVisual>
          <Image src="/static/images/hrd-office.svg" alt="" fill sizes="(max-width: 700px) 100vw, 50vw" preload />
          <S.VisualCaption>
            <S.GoldLine  />
            <Typography variant="body2">មនុស្ស • សមត្ថភាព • គុណភាព</Typography>
          </S.VisualCaption>
        </S.FeatureVisual>
        <S.FeatureCopy  aria-live="polite" aria-atomic="true">
          <S.FeatureEyebrow variant="overline">{slide.eyebrow}</S.FeatureEyebrow>
          <S.FeatureTitle component="h2" variant="h4">{slide.title}</S.FeatureTitle>
          <S.FeatureDescription variant="body1">{slide.description}</S.FeatureDescription>
          <S.HeroButton component={Link} href="/hrd/documents"  endIcon={<ArrowRight size={18} />}>
            {slide.action}
          </S.HeroButton>
        </S.FeatureCopy>
        <S.CarouselArrow data-direction="previous" aria-label="ព័ត៌មានមុន" onClick={() => changeSlide(-1)}>
          <ArrowLeft size={20} />
        </S.CarouselArrow>
        <S.CarouselArrow data-direction="next" aria-label="ព័ត៌មានបន្ទាប់" onClick={() => changeSlide(1)}>
          <ArrowRight size={20} />
        </S.CarouselArrow>
      </S.Feature>
      <S.Pagination  aria-label="ជ្រើសរើសព័ត៌មាន">
        {HRD_HOME_HIGHLIGHTS.map((highlight, index) => (
          <S.Dot key={highlight.eyebrow} type="button"  aria-label={`ព័ត៌មាន ${index + 1}`}
            aria-pressed={slideIndex === index} onClick={() => setSlideIndex(index)} />
        ))}
      </S.Pagination>

      <S.Section aria-labelledby="hrd-documents-heading">
        <S.SectionHeading ref={reveal} data-scroll-reveal="slide-up">
          <Typography component="h2" variant="h4" id="hrd-documents-heading">ឯកសារសំខាន់ៗ</Typography>
          <Button component={Link} href="/hrd/documents" endIcon={<ArrowRight size={17} />}>មើលទាំងអស់</Button>
        </S.SectionHeading>
        <S.DocumentGrid>
          {featuredDocuments.map((document, index) => (
            <S.DocumentCard ref={reveal} data-scroll-reveal="fade-up" href="/hrd/documents" key={document.id}>
              <S.DocumentCover data-cover={index}>
                <Typography variant="caption">នាយកដ្ឋានធនធានមនុស្ស</Typography>
                <FileText size={48} strokeWidth={1} aria-hidden="true" />
                <Typography component="span" variant="h6">ទម្រង់ពាក្យស្នើសុំ</Typography>
                <Typography variant="caption">{document.fileTypes.join(" / ")}</Typography>
              </S.DocumentCover>
              <S.CardCopy>
                <S.Category variant="caption">{document.category}</S.Category>
                <Typography component="h3" variant="subtitle1" fontWeight={700}>{document.title}</Typography>
                <S.Secondary variant="body2">{document.description}</S.Secondary>
              </S.CardCopy>
            </S.DocumentCard>
          ))}
        </S.DocumentGrid>
      </S.Section>

      <S.Welcome ref={reveal} data-scroll-reveal="flip-left" aria-labelledby="hrd-welcome-heading">
        <S.WelcomeSymbol><Users size={68} strokeWidth={1} aria-hidden="true" />
          <Typography variant="overline">HUMAN RESOURCE DEPARTMENT</Typography>
        </S.WelcomeSymbol>
        <S.WelcomeCopy>
          <S.Category variant="overline">សូមស្វាគមន៍</S.Category>
          <Typography component="h2" variant="h4" id="hrd-welcome-heading">ស្វាគមន៍មកកាន់នាយកដ្ឋានធនធានមនុស្ស</Typography>
          <Typography variant="body1">គេហទំព័រនេះប្រមូលផ្ដុំទម្រង់ពាក្យស្នើសុំ និងឯកសារពាក់ព័ន្ធ ដើម្បីជួយមន្រ្តីរាជការស៊ីវិលស្វែងរក និងទាញយកឯកសារបានកាន់តែងាយស្រួល។</Typography>
          <Typography variant="body1">អ្នកអាចចូលទៅកាន់បណ្ដុំឯកសារ ឬទាក់ទងមកនាយកដ្ឋានតាមព័ត៌មានទំនាក់ទំនងខាងក្រោម។</Typography>
          <Button component={Link} href="/hrd/documents" endIcon={<ArrowRight size={18} />}>ចូលទៅបណ្ដុំឯកសារ</Button>
        </S.WelcomeCopy>
      </S.Welcome>

      <S.QuickLinks ref={reveal} data-scroll-reveal="flip-up" aria-label="តំណភ្ជាប់រហ័ស">
        <Link href="/hrd/documents"><FolderOpen aria-hidden="true" /><Typography variant="subtitle1" fontWeight={700}>បណ្ដុំឯកសារ</Typography><ArrowRight size={18} /></Link>
        <a href="#hrd-resources"><FileText aria-hidden="true" /><Typography variant="subtitle1" fontWeight={700}>ទម្រង់ពាក្យស្នើសុំ</Typography><ArrowRight size={18} /></a>
        <a href="#hrd-contact"><Mail aria-hidden="true" /><Typography variant="subtitle1" fontWeight={700}>ទំនាក់ទំនង</Typography><ArrowRight size={18} /></a>
      </S.QuickLinks>

      <S.Section  id="hrd-resources" aria-labelledby="hrd-resources-heading">
        <S.SectionHeading ref={reveal} data-scroll-reveal="slide-up">
          <Typography component="h2" variant="h4" id="hrd-resources-heading">ទម្រង់ពាក្យសម្រាប់មន្រ្តីរាជការ</Typography>
          <Button component={Link} href="/hrd/documents" endIcon={<ArrowRight size={17} />}>ឯកសារទាំងអស់</Button>
        </S.SectionHeading>
        <S.ResourceGrid>
          {resources.map((document) => (
            <S.ResourceCard ref={reveal} data-scroll-reveal="zoom-in" key={document.id} href="/hrd/documents">
              <FileText size={28} strokeWidth={1.5} aria-hidden="true" />
              <Typography component="h3" variant="subtitle1" fontWeight={700}>{document.title}</Typography>
              <S.Secondary variant="caption">{document.fileTypes.join(" · ")} / {document.fileSize}</S.Secondary>
              <ArrowRight size={18} aria-hidden="true" />
            </S.ResourceCard>
          ))}
        </S.ResourceGrid>
      </S.Section>

      <S.Contact ref={reveal} data-scroll-reveal="fade" id="hrd-contact" aria-labelledby="hrd-contact-heading">
        <div>
          <Typography component="h2" variant="h5" id="hrd-contact-heading">ត្រូវការព័ត៌មានបន្ថែម?</Typography>
          <Typography variant="body1">សូមទាក់ទងនាយកដ្ឋានធនធានមនុស្ស</Typography>
        </div>
        {HRD_SITE.contact.email && (
          <Button component="a" href={`mailto:${HRD_SITE.contact.email}`} variant="outlined" startIcon={<Mail size={18} />}>ទំនាក់ទំនងតាមអ៊ីមែល</Button>
        )}
      </S.Contact>
    </S.Root>
  );
}
