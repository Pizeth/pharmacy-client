"use client";

import { Box, Chip, Stack, Tooltip, Typography } from "@mui/material";
import type { TranslationValue } from "../schemas";

/**
 * ------------------------------------------------------------------
 * Empty-value cell representation for TranslationKey-specific cells.
 * ------------------------------------------------------------------
 */

export function TranslationKeyEmptyCell() {
  return (
    <Typography component="span" variant="body2" color="text.disabled">
      —
    </Typography>
  );
}

/**
 * ------------------------------------------------------------------
 * Category cell
 * ------------------------------------------------------------------
 */

export interface TranslationKeyCategoryCellProps {
  readonly name: string;
}

export function TranslationKeyCategoryCell({
  name,
}: TranslationKeyCategoryCellProps) {
  return <Chip label={name} size="small" variant="outlined" />;
}

/**
 * ------------------------------------------------------------------
 * Available Locale badges
 * ------------------------------------------------------------------
 */

export interface TranslationKeyLocalesCellProps {
  readonly translations: readonly TranslationValue[];
}

export function TranslationKeyLocalesCell({
  translations,
}: TranslationKeyLocalesCellProps) {
  if (translations.length === 0) {
    return <TranslationKeyEmptyCell />;
  }

  return (
    <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
      {translations.map((translation) => (
        <Chip key={translation.id} label={translation.locale} size="small" />
      ))}
    </Stack>
  );
}

/**
 * ------------------------------------------------------------------
 * Translation value preview
 * ------------------------------------------------------------------
 */

export interface TranslationKeyValuesCellProps {
  readonly translations: readonly TranslationValue[];
}

export function TranslationKeyValuesCell({
  translations,
}: TranslationKeyValuesCellProps) {
  if (translations.length === 0) {
    return <TranslationKeyEmptyCell />;
  }

  return (
    <Stack
      spacing={0.5}
      sx={{
        minWidth: 0,
      }}
    >
      {translations.map((translation) => (
        <Box
          key={translation.id}
          sx={{
            display: "flex",
            alignItems: "baseline",
            gap: 1,
            minWidth: 0,
          }}
        >
          <Typography
            component="span"
            variant="caption"
            color="text.secondary"
            sx={{
              flex: "0 0 auto",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            {translation.locale}
          </Typography>

          <Tooltip title={translation.value} placement="top-start">
            <Typography
              component="span"
              variant="body2"
              noWrap
              sx={{
                minWidth: 0,
                maxWidth: 360,
              }}
            >
              {translation.value}
            </Typography>
          </Tooltip>
        </Box>
      ))}
    </Stack>
  );
}

/**
 * ------------------------------------------------------------------
 * Date/time presentation
 * ------------------------------------------------------------------
 *
 * The transport contract correctly keeps timestamps as strings.
 *
 * Conversion to Date happens here at the presentation boundary.
 */

const translationDateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export interface TranslationKeyDateTimeCellProps {
  readonly value: string;
}

export function TranslationKeyDateTimeCell({
  value,
}: TranslationKeyDateTimeCellProps) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return <TranslationKeyEmptyCell />;
  }

  return (
    <Tooltip title={value}>
      <Typography component="span" variant="body2" noWrap>
        {translationDateTimeFormatter.format(date)}
      </Typography>
    </Tooltip>
  );
}
