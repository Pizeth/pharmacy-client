"use client";

import {
  Box,
  Chip,
  Typography,
  TypographyProps,
  styled,
} from "@mui/material";
import {
  AddRounded,
  DeleteOutline,
  EditOutlined,
  TranslateOutlined,
} from "@mui/icons-material";
import { ResourceActionButton } from "@/components/buttons";
import type { TranslationKey, TranslationValue } from "../schemas";

import {
  getTranslationKeyLocaleLabel,
  TRANSLATION_KEY_LOCALE_OPTIONS,
} from "../locales";

const COMPONENT_NAME = "RazethTranslationValuesPanel";

/**
 * ================================================================
 * Root
 * ================================================================
 *
 * Resource-specific detail-panel content.
 *
 * The generic DataTable owns:
 *
 * - expansion state
 * - detail row
 * - detail cell
 * - ARIA relationship
 * - colSpan
 *
 * This component owns only TranslationKey-specific content.
 */
const Root = styled("section", {
  name: COMPONENT_NAME,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})({});

/**
 * ================================================================
 * Heading
 * ================================================================
 */
const HeadingRoot = styled("header", {
  name: COMPONENT_NAME,
  slot: "Heading",
  overridesResolver: (_props, styles) => styles.heading,
})({});

/**
 * ================================================================
 * Heading main wrapper region
 * ================================================================
 */
const HeaderTextRoot = styled(Box, {
  name: COMPONENT_NAME,
  slot: "Wrapper",
  overridesResolver: (_props, styles) => styles.wrapper,
})({});

/**
 * ================================================================
 * Heading main region
 * ================================================================
 */
// const HeadingMainRoot = styled(Box, {
//   name: COMPONENT_NAME,
//   slot: "Main",
//   overridesResolver: (_props, styles) => styles.main,
// })({});

/**
 * ================================================================
 * Content
 * ================================================================
 */
const ContentRoot = styled(Box, {
  name: COMPONENT_NAME,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})({});

/**
 * ================================================================
 * Individual locale item
 * ================================================================
 */
const ItemRoot = styled("div", {
  name: COMPONENT_NAME,
  slot: "Item",
  overridesResolver: (_props, styles) => styles.item,
})({});

const LocaleRoot = styled(Chip, {
  name: COMPONENT_NAME,
  slot: "Label",
  overridesResolver: (_props, styles) => styles.label,
})({});

// const ValueRoot = styled(Typography, {
//   name: COMPONENT_NAME,
//   slot: "Main",
//   overridesResolver: (_props, styles) => styles.main,
// })({});

// const EmptyRoot = styled(Typography, {
//   name: COMPONENT_NAME,
//   slot: "Caption",
//   overridesResolver: (_props, styles) => styles.caption,
// })({});

/**
 * ================================================================
 * Item value region
 * ================================================================
 */
const ItemValueRoot = styled("div", {
  name: COMPONENT_NAME,
  slot: "Main",
  overridesResolver: (_props, styles) => styles.main,
})({});

const ItemActionsRoot = styled("div", {
  name: COMPONENT_NAME,
  slot: "Button",
  overridesResolver: (_props, styles) => styles.button,
})({});

/**
 * ================================================================
 * Secondary metadata
 * ================================================================
 */
const CaptionRoot = styled(Typography, {
  name: COMPONENT_NAME,
  slot: "Caption",
  overridesResolver: (_props, styles) => styles.caption,
})<TypographyProps>({});

const translationDateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export interface TranslationKeyTranslationsPanelProps {
  readonly record: TranslationKey;
  readonly onCreate: (record: TranslationKey) => void;
  readonly onEdit: (
    record: TranslationKey,
    translation: TranslationValue,
  ) => void;

  readonly onDelete: (
    record: TranslationKey,
    translation: TranslationValue,
  ) => void;
}

function formatUpdatedAt(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return translationDateTimeFormatter.format(date);
}

/**
 * TranslationValue management surface belonging to one expanded
 * TranslationKey row.
 *
 * Current resource responsibilities:
 *
 * - render canonical nested values from row.original.translations
 * - delegate creation to the TranslationKey resource parent
 * - delegate editing to the TranslationKey resource parent
 * - delegate destructive deletion to the TranslationKey resource parent
 *
 * The generic DataTable continues to own only expansion/detail-panel
 * mechanics. TranslationValue mutation state never enters DataTable.
 *
 * The panel therefore remains a presentation/command surface. Dialog
 * ownership, request state, retry behavior, and refresh policy stay at
 * the resource boundary.
 */
export function TranslationKeyTranslationsPanel(
  props: TranslationKeyTranslationsPanelProps,
) {
  const {
    record,
    onCreate,
    onEdit,
    onDelete,
  } = props;

  const translations = [...record.translations].sort((left, right) =>
    left.locale.localeCompare(right.locale),
  );

  const existingLocales = new Set(
    translations.map((translation) => translation.locale),
  );

  const canCreate = TRANSLATION_KEY_LOCALE_OPTIONS.some(
    (option) => !existingLocales.has(option.value),
  );

  const count = translations.length;

  return (
    <Root data-translation-key-id={record.id}>
      <HeadingRoot>
        <TranslateOutlined />

        <HeaderTextRoot>
          <Typography component="h3" variant="subtitle1" fontWeight={700}>
            Translations
          </Typography>

          <Typography component="p" variant="caption" color="text.secondary">
            {count} of {TRANSLATION_KEY_LOCALE_OPTIONS.length} supported locales
            for <strong>{record.key}</strong>
          </Typography>
        </HeaderTextRoot>

        <ItemActionsRoot>
          <ResourceActionButton
            size="small"
            variant="outlined"
            color="warning"
            startIcon={<AddRounded />}
            disabled={!canCreate}
            onClick={() => {
              onCreate(record);
            }}
          >
            Add translation
          </ResourceActionButton>
        </ItemActionsRoot>
      </HeadingRoot>

      {count === 0 ? (
        <CaptionRoot
          component="p"
          variant="body2"
          color="text.secondary"
          data-empty="true"
        >
          No translation values yet.
        </CaptionRoot>
      ) : (
        <ContentRoot role="list">
          {translations.map((translation) => (
            <ItemRoot
              key={translation.id}
              data-translation-locale={translation.locale}
              role="listitem"
            >
              <LocaleRoot
                size="small"
                color="primary"
                variant="outlined"
                label={getTranslationKeyLocaleLabel(translation.locale)}
              />

              <ItemValueRoot>
                <Typography component="p" variant="body2">
                  {translation.value}
                </Typography>
              </ItemValueRoot>

              <CaptionRoot component="p" variant="caption">
                Updated {formatUpdatedAt(translation.updatedAt)}
              </CaptionRoot>

              <ItemActionsRoot>
                <ResourceActionButton
                  size="small"
                  variant="text"
                  color="primary"
                  startIcon={<EditOutlined />}
                  onClick={() => {
                    onEdit(record, translation);
                  }}
                >
                  Edit
                </ResourceActionButton>

                <ResourceActionButton
                  size="small"
                  variant="text"
                  color="error"
                  startIcon={<DeleteOutline />}
                  onClick={() => {
                    onDelete(
                      record,
                      translation,
                    );
                  }}
                >
                  Delete
                </ResourceActionButton>
              </ItemActionsRoot>
            </ItemRoot>
          ))}
        </ContentRoot>
      )}
    </Root>
  );
}
