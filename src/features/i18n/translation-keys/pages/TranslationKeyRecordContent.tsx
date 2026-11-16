"use client";
import { ResourceBadge as Chip } from "@/components/Tables/ResourceBadge";
import { useState } from "react";
import { Alert, Button, Typography } from "@mui/material";
import { TranslateOutlined, LanguageOutlined, CategoryOutlined, AddRounded, EditOutlined, DeleteOutline, InfoOutlined } from "@mui/icons-material";
import { RecordHero, RecordCard, RecordFacts, RecordMetrics } from "@/components/Tables/ResourceRecordPage";
import * as S from "@/components/Tables/resourceRecordStyles";
import { formatAdminDate } from "@/lib/utils/adminDate";
import { getTranslationKeyLocaleLabel, getTranslationKeyLocaleColor, TRANSLATION_KEY_LOCALE_OPTIONS } from "../locales";
import type { TranslationKey, TranslationValue } from "../schemas";
import { TranslationValueCreateDialog } from "../forms/TranslationValueCreateDialog";
import { TranslationValueEditDialog } from "../forms/TranslationValueEditDialog";
import { TranslationValueDeleteDialog } from "../forms/TranslationValueDeleteDialog";

export function TranslationKeyRecordContent({ record, onChanged }: { readonly record: TranslationKey; readonly onChanged: () => void }) {
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<TranslationValue | null>(null);
  const [deleting, setDeleting] = useState<TranslationValue | null>(null);
  const [notice, setNotice] = useState("");
  const missing = TRANSLATION_KEY_LOCALE_OPTIONS.filter(option => !record.translations.some(value => value.locale === option.value && value.value.trim()));
  const available = TRANSLATION_KEY_LOCALE_OPTIONS.filter(option => !record.translations.some(value => value.locale === option.value));
  const complete = TRANSLATION_KEY_LOCALE_OPTIONS.length - missing.length;
  const changed = (message: string) => { setCreating(false); setEditing(null); setDeleting(null); setNotice(message); onChanged(); };
  return <>
    <RecordHero eyebrow="Translation key" title={record.key} description={record.description ?? "No description has been recorded for this key."} icon={<TranslateOutlined />} badges={<Chip size="small" label={missing.length ? "Translations need attention" : "Supported locales complete"} color={missing.length ? "warning" : "success"} />} />
    <RecordMetrics items={[{ label: "Stored translations", value: record.translations.length }, { label: "Supported locales filled", value: `${complete} / ${TRANSLATION_KEY_LOCALE_OPTIONS.length}` }, { label: "Missing or empty locales", value: missing.length }]} />
    {notice && <Alert severity="success" onClose={() => setNotice("")}>{notice}</Alert>}
    <S.Layout><S.Main>
      <RecordCard title="Translation coverage" icon={<LanguageOutlined />} description="Coverage is measured against the application's supported locale registry.">
        <S.List>{TRANSLATION_KEY_LOCALE_OPTIONS.map(option => { const value = record.translations.find(translation => translation.locale === option.value); const filled = !!value?.value.trim(); return <S.ListItem key={option.value}><S.Badges><Typography variant="subtitle2">{option.label}</Typography><Chip size="small" color={filled ? "success" : "warning"} label={filled ? "Translated" : value ? "Empty value" : "Missing translation"} /></S.Badges><Typography variant="caption" color="text.secondary">Locale code: {option.value}</Typography></S.ListItem>; })}</S.List>
        {!!missing.length && <Alert severity="warning">Missing or empty translations: {missing.map(option => option.label).join(", ")}. Existing empty values can be edited below.</Alert>}
      </RecordCard>
      <RecordCard title="Locale values" icon={<TranslateOutlined />} description="Full translation text and per-locale timestamps." action={<Button startIcon={<AddRounded />} onClick={() => setCreating(true)} disabled={!available.length}>Add translation</Button>}>
        {record.translations.length ? <S.List>{record.translations.map(value => <S.ListItem key={value.id}>
          <S.Badges><Typography component="h3" variant="h6">{getTranslationKeyLocaleLabel(value.locale)} translation</Typography><Chip size="small" color={getTranslationKeyLocaleColor(value.locale)} variant="outlined" label={value.locale} /></S.Badges>
          <S.Prose component="p" lang={value.locale} variant="body1">{value.value || "No text recorded."}</S.Prose>
          <RecordFacts items={[{ label: "Created", value: formatAdminDate(value.createdAt) }, { label: "Last updated", value: formatAdminDate(value.updatedAt) }]} />
          <S.Actions><Button color="error" startIcon={<EditOutlined />} aria-label={`Edit ${getTranslationKeyLocaleLabel(value.locale)} translation`} onClick={() => setEditing(value)}>Edit translation</Button><Button color="primary" startIcon={<DeleteOutline />} aria-label={`Delete ${getTranslationKeyLocaleLabel(value.locale)} translation`} onClick={() => setDeleting(value)}>Delete translation</Button></S.Actions>
        </S.ListItem>)}</S.List> : <Alert severity="info">No translations yet. Add the first supported locale to start translating this key.</Alert>}
      </RecordCard>
    </S.Main><S.Aside data-record-sidebar>
      <RecordCard title="Category" icon={<CategoryOutlined />}><RecordFacts items={[{ label: "Category name", value: record.translationCategory.name }, { label: "Category description", value: record.translationCategory.description || "No category description." }]} /></RecordCard>
      <RecordCard title="Record information" icon={<InfoOutlined />}><RecordFacts items={[{ label: "Created", value: formatAdminDate(record.createdAt) }, { label: "Last updated", value: formatAdminDate(record.updatedAt) }]} /></RecordCard>
      <RecordCard title="Locale guidance"><Typography variant="body2" color="text.secondary">English and Khmer are the supported creation options. Any other locale already stored by the API remains visible with its original locale code.</Typography><Typography variant="body2" color="text.secondary">Editing the key changes metadata; editing a locale changes only the text for that locale.</Typography></RecordCard>
    </S.Aside></S.Layout>
    {creating && <TranslationValueCreateDialog record={record} onClose={() => setCreating(false)} onCreated={() => changed("Translation added.")} />}
    {editing && <TranslationValueEditDialog record={record} translation={editing} onClose={() => setEditing(null)} onUpdated={() => changed("Translation updated.")} />}
    {deleting && <TranslationValueDeleteDialog record={record} translation={deleting} onClose={() => setDeleting(null)} onDeleted={() => changed("Translation deleted.")} />}
  </>;
}
