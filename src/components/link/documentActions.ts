// src/components/link/documentActions.ts

import { resolvePublicDocumentExtension } from "./openPublicDocument";
import type { PublicDocumentRecord } from "./types";
export type PublicDocumentActionId = "view" | "download";
export type PublicDocumentViewKind = "pdf" | "image";
import { isBrowserViewableImageExtension } from "./fileTypes";

// const IMAGE_EXTENSIONS: ReadonlySet<string> = new Set([
//   "png",
//   "jpg",
//   "jpeg",
//   "gif",
//   "webp",
//   "avif",
//   "bmp",
//   "svg",
// ]);

/**
 * What kind of file the viewer can show, or null when it cannot.
 *
 * Judged on the document's file (fileUrl) extension, so a document listed
 * as ["PDF", "DOCX"] whose fileUrl points at a .docx file is not viewable.
 */
export function getPublicDocumentViewKind(
  doc: PublicDocumentRecord,
): PublicDocumentViewKind | null {
  const extension = resolvePublicDocumentExtension(doc);

  if (extension === "pdf") {
    return "pdf";
  }

  return isBrowserViewableImageExtension(extension) ? "image" : null;
}

/**
 * View is only offered for a real file (fileUrl), never for a Drive link,
 * and only for PDFs and images.
 */
export function canViewPublicDocument(doc: PublicDocumentRecord): boolean {
  return Boolean(doc.fileUrl) && getPublicDocumentViewKind(doc) !== null;
}

/**
 * Download is offered for both Drive links and files.
 */
export function canDownloadPublicDocument(doc: PublicDocumentRecord): boolean {
  return Boolean(doc.driveUrl || doc.fileUrl);
}

export type PublicDocumentActionPredicate = (
  doc: PublicDocumentRecord,
) => boolean;

/**
 * Per-action visibility.
 *
 * - omitted: use the default rule (link/file type based, see above)
 * - false:   never show this action
 * - true:    always show it
 * - function: custom rule
 */
export interface PublicDocumentActionsConfig {
  readonly view?: boolean | PublicDocumentActionPredicate;
  readonly download?: boolean | PublicDocumentActionPredicate;
}

const DEFAULT_RULES: Record<
  PublicDocumentActionId,
  PublicDocumentActionPredicate
> = {
  view: canViewPublicDocument,
  download: canDownloadPublicDocument,
};

export function isPublicDocumentActionAvailable(
  id: PublicDocumentActionId,
  doc: PublicDocumentRecord,
  config: PublicDocumentActionsConfig = {},
): boolean {
  const rule = config[id];

  if (typeof rule === "boolean") {
    return rule;
  }

  return (rule ?? DEFAULT_RULES[id])(doc);
}

export interface PublicDocumentActionHandlers {
  readonly onView: (doc: PublicDocumentRecord) => void;
  readonly onDownload: (doc: PublicDocumentRecord) => void;
}

export interface PublicDocumentActionDescriptor {
  readonly id: PublicDocumentActionId;
  readonly label: string;
  readonly isAvailable: PublicDocumentActionPredicate;
  readonly run: (doc: PublicDocumentRecord) => void;
}

/**
 * The directory's actions, defined once and rendered twice: as labelled
 * buttons in the table and as icon-only buttons on cards.
 */
export const PUBLIC_DOCUMENT_ACTION_LABELS: Record<
  PublicDocumentActionId,
  string
> = {
  view: "មើលឯកសារ",
  download: "ទាញយកឯកសារ",
};

export function createPublicDocumentActions(
  handlers: PublicDocumentActionHandlers,
  config: PublicDocumentActionsConfig = {},
): readonly PublicDocumentActionDescriptor[] {
  return [
    {
      id: "view",
      label: PUBLIC_DOCUMENT_ACTION_LABELS.view,
      isAvailable: (doc) =>
        isPublicDocumentActionAvailable("view", doc, config),
      run: handlers.onView,
    },
    {
      id: "download",
      label: PUBLIC_DOCUMENT_ACTION_LABELS.download,
      isAvailable: (doc) =>
        isPublicDocumentActionAvailable("download", doc, config),
      run: handlers.onDownload,
    },
  ];
}
