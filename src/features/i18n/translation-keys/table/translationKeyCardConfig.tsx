"use client";

import {
  Chip,
  Stack,
  Typography,
  styled,
} from "@mui/material";

import type {
  DataTableCardConfig,
  DataTableRowAction,
} from "@/components/DataTable";

import {
  getTranslationKeyLocaleLabel,
} from "../locales";
import type {
  TranslationKey,
} from "../schemas";

const COMPONENT_NAME =
  "RazethTranslationKeyCard";

const HeaderRoot = styled(
  Stack,
  {
    name:
      COMPONENT_NAME,
    slot:
      "Header",
    overridesResolver:
      (
        _props,
        styles,
      ) =>
        styles.header,
  },
)({
  minWidth:
    0,
});

const BodyRoot = styled(
  Stack,
  {
    name:
      COMPONENT_NAME,
    slot:
      "Content",
    overridesResolver:
      (
        _props,
        styles,
      ) =>
        styles.content,
  },
)({
  minWidth:
    0,
});

const TranslationPreviewRoot =
  styled(
    Stack,
    {
      name:
        COMPONENT_NAME,
      slot:
        "Item",
      overridesResolver:
        (
          _props,
          styles,
        ) =>
          styles.item,
    },
  )({
    minWidth:
      0,
  });

const MetadataRoot = styled(
  Stack,
  {
    name:
      COMPONENT_NAME,
    slot:
      "Caption",
    overridesResolver:
      (
        _props,
        styles,
      ) =>
        styles.caption,
  },
)({
  minWidth:
    0,
});

const dateTimeFormatter =
  new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle:
        "medium",
      timeStyle:
        "short",
    },
  );

function formatDateTime(
  value: string,
): string {
  const date =
    new Date(
      value,
    );

  return Number.isNaN(
    date.getTime(),
  )
    ? value
    : dateTimeFormatter.format(
        date,
      );
}

export interface CreateTranslationKeyCardConfigOptions {
  readonly rowActions:
    readonly DataTableRowAction<TranslationKey>[];
}

/**
 * Resource-owned card composition for TranslationKey.
 *
 * The generic DataTable still owns:
 *
 * - card structure,
 * - selection,
 * - expansion,
 * - row actions,
 * - pagination,
 * - search/filter state,
 * - display-mode persistence.
 *
 * This factory owns only TranslationKey-specific content.
 */
export function createTranslationKeyCardConfig(
  options:
    CreateTranslationKeyCardConfigOptions,
): DataTableCardConfig<TranslationKey> {
  const {
    rowActions,
  } = options;

  return {
    detailMode: "flip",
    flip: {
      // Keep key actions on the front until details are explicitly requested.
      flipOnHover: false,
      labels: {
        showDetails: "Show translations",
        hideDetails: "Back to key",
      },
    },
    enableSelection:
      true,

    enableExpansion:
      true,

    actions:
      rowActions,

    maxInlineActions:
      2,

    renderHeader: ({
      row,
    }) => (
      <HeaderRoot
        spacing={
          0.25
        }
      >
        <Typography
          component="strong"
          variant="subtitle2"
          noWrap
        >
          {
            row.original
              .key
          }
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          noWrap
        >
          {
            row.original
              .translationCategory
              .name
          }
        </Typography>
      </HeaderRoot>
    ),

    renderBody: ({
      row,
    }) => {
      const translations =
        [
          ...row.original
            .translations,
        ]
          .sort(
            (
              left,
              right,
            ) =>
              left.locale.localeCompare(
                right.locale,
              ),
          )
          .slice(
            0,
            2,
          );

      return (
        <BodyRoot
          spacing={
            1.5
          }
        >
          <Typography
            variant="body2"
            color={
              row
                .original
                .description
                ? "text.primary"
                : "text.secondary"
            }
          >
            {
              row.original
                .description ??
              "No description"
            }
          </Typography>

          {translations.length >
          0 ? (
            <Stack
              spacing={
                1
              }
            >
              {translations.map(
                (
                  translation,
                ) => (
                  <TranslationPreviewRoot
                    key={
                      translation.id
                    }
                    direction="row"
                    spacing={
                      1
                    }
                    alignItems="flex-start"
                  >
                    <Chip
                      size="small"
                      variant="outlined"
                      label={
                        getTranslationKeyLocaleLabel(
                          translation.locale,
                        )
                      }
                    />

                    <Typography
                      variant="body2"
                      noWrap
                      title={
                        translation.value
                      }
                    >
                      {
                        translation.value
                      }
                    </Typography>
                  </TranslationPreviewRoot>
                ),
              )}

              {row.original
                .translations
                .length >
                translations.length && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  +
                  {row
                    .original
                    .translations
                    .length -
                    translations.length}{" "}
                  more translation
                  {row
                    .original
                    .translations
                    .length -
                    translations.length ===
                  1
                    ? ""
                    : "s"}
                </Typography>
              )}
            </Stack>
          ) : (
            <Typography
              variant="caption"
              color="text.secondary"
            >
              No translation values yet.
            </Typography>
          )}
        </BodyRoot>
      );
    },

    renderMetadata: ({
      row,
    }) => (
      <MetadataRoot
        direction="row"
        spacing={
          1
        }
        alignItems="center"
        flexWrap="wrap"
        useFlexGap
      >
        <Chip
          size="small"
          color="primary"
          variant="outlined"
          label={
            `${row.original.translations.length} translation${
              row.original.translations.length === 1 ? "" : "s"
            }`
          }
        />

        <Typography
          variant="caption"
          color="text.secondary"
        >
          Updated{" "}
          {
            formatDateTime(
              row.original
                .updatedAt,
            )
          }
        </Typography>
      </MetadataRoot>
    ),
  };
}
