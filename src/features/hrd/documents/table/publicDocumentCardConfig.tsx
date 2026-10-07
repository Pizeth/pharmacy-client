"use client";

// src/features/hrd/documents/table/publicDocumentCardConfig.tsx

import { Chip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Download, Eye, FileText } from "lucide-react";
import type { ReactNode } from "react";

import type {
  DataTableCardConfig,
  DataTableRowAction,
} from "@/components/DataTable/index";

import type {
  PublicDocumentActionDescriptor,
  PublicDocumentActionId,
} from "../actions/documentActions";
import { publicDocumentsSlot } from "../../styles/styled";
import type { PublicDocumentRecord } from "../../types/publicDocuments.types";
import { FileTypeBadge } from "../components/FileTypeBadge";

const CardHeader = styled(
  "div",
  publicDocumentsSlot("CardHeader"),
)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  minWidth: 0,
}));

const CardIcon = styled(
  "span",
  publicDocumentsSlot("CardIcon"),
)(({ theme }) => ({
  display: "flex",
  flexShrink: 0,
  borderRadius: 8,
  color: theme.vars.palette.primary.main,
  backgroundColor: theme.alpha(theme.vars.palette.primary.main, 0.1),
}));

const CardTitle = styled(
  Typography,
  publicDocumentsSlot("CardTitle"),
)({
  minWidth: 0,
  fontWeight: 700,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

const CardBody = styled(
  "div",
  publicDocumentsSlot("CardBody"),
)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  minWidth: 0,
  //   minHeight: "200px",
  //   maxHeight: "400px",
}));

const CardDescription = styled(
  Typography,
  publicDocumentsSlot("CardDescription"),
)(({ theme }) => ({
  color: theme.vars.palette.text.secondary,
  // A teaser: the full text is on the back of the card.
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
}));

const DetailRoot = styled("div", publicDocumentsSlot("CardDetail"))(
  ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
    minWidth: 0,
  }),
);

const DetailDescription = styled(
  Typography,
  publicDocumentsSlot("CardDetailDescription"),
)(({ theme }) => ({
  color: theme.vars.palette.text.primary,
  overflowWrap: "anywhere",
}));

const DetailList = styled("dl", publicDocumentsSlot("CardDetailList"))(
  ({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "max-content 1fr",
    alignItems: "center",
    columnGap: theme.spacing(1.5),
    rowGap: theme.spacing(1),
    margin: 0,
  }),
);

const DetailTerm = styled("dt", publicDocumentsSlot("CardDetailTerm"))(
  ({ theme }) => ({
    color: theme.vars.palette.text.secondary,
    fontSize: theme.typography.pxToRem(12),
  }),
);

const DetailValue = styled("dd", publicDocumentsSlot("CardDetailValue"))(
  ({ theme }) => ({
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.spacing(0.75),
    margin: 0,
    minWidth: 0,
  }),
);

const CardMeta = styled(
  "div",
  publicDocumentsSlot("CardMeta"),
)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(0.75),
}));

// const CardFormatBadge = styled(
//   "span",
//   publicDocumentsSlot("CardFormatBadge"),
// )(({ theme }) => ({
//   fontSize: "0.6875rem",
//   fontWeight: 700,
//   padding: "2px 6px",
//   borderRadius: 4,
//   backgroundColor: theme.alpha(theme.vars.palette.primary.main, 0.12),
//   color: theme.vars.palette.primary.main,
//   fontFamily: "monospace",
// }));

const CardFileSize = styled(
  Typography,
  publicDocumentsSlot("CardFileSize"),
)(({ theme }) => ({
  color: theme.vars.palette.text.secondary,
}));

/**
 * Text of the card's flip control and of the labels on its back.
 * Review the Khmer wording here; nothing else in the card hard-codes it.
 */
export const PUBLIC_DOCUMENT_CARD_LABELS = {
  showDetails: "មើលព័ត៌មានលម្អិត",
  hideDetails: "ត្រឡប់ក្រោយ",
  category: "ប្រភេទឯកសារ",
  fileSpecs: "ទំហំឯកសារ",
} as const;

const ACTION_ICONS: Record<PublicDocumentActionId, ReactNode> = {
  view: <Eye size={18} />,
  download: <Download size={18} />,
};

/**
 * Card row actions. They reuse the DataTable's standard row-action
 * contract, which renders icon-only buttons with the label as tooltip and
 * accessible name, and hides an action for rows it does not apply to.
 */
export function createPublicDocumentCardActions(
  actions: readonly PublicDocumentActionDescriptor[],
): readonly DataTableRowAction<PublicDocumentRecord>[] {
  return actions.map((action) => ({
    id: action.id,
    label: action.label,
    color: "error",
    inline: true,
    renderIcon: () => ACTION_ICONS[action.id],
    isHidden: ({ row }) => !action.isAvailable(row.original),
    onClick: ({ row }) => action.run(row.original),
  }));
}

/**
 * Card composition for the public directory. The DataTable owns the card
 * structure, pagination, search and the table/card toggle; this owns only
 * what a document card shows.
 */
export function createPublicDocumentCardConfig(
  actions: readonly PublicDocumentActionDescriptor[],
  compactCard = false,
): DataTableCardConfig<PublicDocumentRecord> {
  return {
    compactCard,
    enableSelection: false,

    // The detail is on the back of the card: hover on desktop, the flip
    // control on touch screens and for the keyboard.
    detailMode: "flip",
    flip: {
      labels: {
        showDetails: PUBLIC_DOCUMENT_CARD_LABELS.showDetails,
        hideDetails: PUBLIC_DOCUMENT_CARD_LABELS.hideDetails,
      },
    },

    actions: createPublicDocumentCardActions(actions),
    maxInlineActions: actions.length,

    renderHeader: ({ row }) => (
      <CardHeader>
        <CardIcon>
          <FileText size={20} />
        </CardIcon>
        <CardTitle variant="subtitle2">{row.original.title}</CardTitle>
      </CardHeader>
    ),

    renderBody: ({ row }) => (
      <CardBody>
        <CardDescription variant="body2">
          {row.original.description}
        </CardDescription>
        <CardMeta>
          <Chip
            label={row.original.category}
            size="small"
            variant="outlined"
            color="primary"
          />
          {row.original.fileTypes.map((type) => (
            <FileTypeBadge key={type} type={type} />
          ))}
          <CardFileSize variant="caption">{row.original.fileSize}</CardFileSize>
        </CardMeta>
      </CardBody>
    ),

    renderDetail: ({ row }) => (
      <DetailRoot>
        <DetailDescription variant="body2">
          {row.original.description}
        </DetailDescription>

        <DetailList>
          <DetailTerm>{PUBLIC_DOCUMENT_CARD_LABELS.category}</DetailTerm>
          <DetailValue>
            <Chip
              label={row.original.category}
              size="small"
              variant="outlined"
              color="primary"
            />
          </DetailValue>

          <DetailTerm>{PUBLIC_DOCUMENT_CARD_LABELS.fileSpecs}</DetailTerm>
          <DetailValue>
            {row.original.fileTypes.map((type) => (
              <FileTypeBadge key={type} type={type} />
            ))}
            <CardFileSize variant="caption">
              {row.original.fileSize}
            </CardFileSize>
          </DetailValue>
        </DetailList>
      </DetailRoot>
    ),
  };
}
