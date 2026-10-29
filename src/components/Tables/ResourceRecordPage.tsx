"use client";
import { useId } from "react";
import { Typography } from "@mui/material";
import * as S from "./resourceRecordStyles";
export { RecordSection, RecordHeading, RecordFields, RecordField } from "./resourceRecordStyles";
import type { ReactNode } from "react";
import NextLink from "next/link";
import { Alert, Button } from "@mui/material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { ResourcePage } from "@/components/layouts/ResourcePage";
import { ResourceFormLoading } from "@/components/forms/ResourceFormLoading";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import { RecordPageActionsProvider, RecordPageActions } from "./recordPageActions";
export function ResourceRecordPage({
  title, subtitle, backHref, editHref, loading, error, onRetry, children, actions,
}: {
  readonly title: string;
  readonly subtitle?: string;
  readonly actions?: ReactNode;
  readonly backHref: string;
  readonly editHref?: string;
  readonly loading: boolean;
  readonly error?: string;
  readonly onRetry: () => void;
  readonly children: ReactNode;
}) {
  const navigation = <>
    <Button component={NextLink} href={backHref} color="inherit" startIcon={<ArrowBackOutlined />}>Back to list</Button>
    {!loading && !error && actions}
    {!loading && !error && editHref && <Button component={NextLink} href={editHref} variant="contained" startIcon={<EditOutlined />}>Edit</Button>}
  </>;
  return <ResourcePage title={title} titleComponent="h1" showHeader={false} subtitle={subtitle} maxWidth="xl">
    <RecordPageActionsProvider value={!loading && !error ? navigation : null}>
      <S.RecordSection>
        {(loading || error) && <><Typography component="h1" variant="h6">{title}</Typography><S.Toolbar aria-label="Record actions">{navigation}</S.Toolbar></>}
        {loading ? <ResourceFormLoading message="Loading details..." /> : error ? <Alert severity="error" action={<Button onClick={onRetry}>Retry</Button>}>{error}</Alert> : children}
      </S.RecordSection>
    </RecordPageActionsProvider>
  </ResourcePage>;

}
export function isResourceIntegerId(id: string): boolean {
  return /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id));
}

export function RecordHero({ title, eyebrow, description, icon, badges }: {
  readonly title: string; readonly eyebrow: string; readonly description?: string | null;
  readonly icon: ReactNode; readonly badges?: ReactNode;
}) {
  return <S.Hero><S.HeroIcon aria-hidden="true">{icon}</S.HeroIcon><S.HeroBody>
    <Typography variant="overline" color="text.secondary">{eyebrow}</Typography>
    <Typography component="h1" variant="h5">{title}</Typography>
    {description && <S.Prose variant="body2" color="text.secondary">{description}</S.Prose>}
    {badges && <S.Badges>{badges}</S.Badges>}
  </S.HeroBody><RecordPageActions /></S.Hero>;
}
export function RecordCard({ title, description, icon, action, children }: {
  readonly title: string; readonly description?: string; readonly icon?: ReactNode;
  readonly action?: ReactNode; readonly children: ReactNode;
}) {
  const id = useId();
  return <S.Section aria-labelledby={id}><S.SectionHeader><div>
    <Typography id={id} component="h2" variant="h6">{icon}{title}</Typography>
    {description && <Typography variant="body2" color="text.secondary">{description}</Typography>}
  </div>{action}</S.SectionHeader><S.SectionContent>{children}</S.SectionContent></S.Section>;
}
export function RecordFacts({ items, inline = false }: { readonly inline?: boolean; readonly items: readonly { label: string; value: ReactNode; wide?: boolean }[] }) {
  return <S.RecordFields data-inline={inline || undefined}>{items.map(item => <S.RecordField key={item.label} data-wide={item.wide || undefined}><dt>{item.label}</dt><dd>{item.value ?? "Not provided"}</dd></S.RecordField>)}</S.RecordFields>;
}
export function RecordMetrics({ items }: { readonly items: readonly { label: string; value: ReactNode }[] }) {
  return <S.Metrics>{items.map(item => <S.Metric key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></S.Metric>)}</S.Metrics>;
}
