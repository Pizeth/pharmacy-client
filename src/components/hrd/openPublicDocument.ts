// src/components/hrd/openPublicDocument.ts

import type { PublicDocumentRecord } from "./types";

export type PublicDocumentOpenResult = "link" | "download";

/**
 * Extension of a URL's path, ignoring query string and fragment.
 */
function extensionFromUrl(url: string): string | null {
  const path = url.split(/[?#]/, 1)[0];
  const match = /\.([A-Za-z0-9]{1,8})$/.exec(path);

  return match ? match[1].toLowerCase() : null;
}

/**
 * Lower-case extension of the document's concrete file.
 *
 * A fileUrl points at one concrete file, so its own extension wins;
 * otherwise the document's primary (first) format is used.
 */
export function resolvePublicDocumentExtension(
  doc: PublicDocumentRecord,
): string {
  return (
    (doc.fileUrl ? extensionFromUrl(doc.fileUrl) : null) ??
    doc.fileTypes[0].toLowerCase()
  );
}

function safeFileName(doc: PublicDocumentRecord): string {
  const base = doc.title.toLowerCase().replace(/[^a-z0-9]+/g, "_");

  return `${doc.id.toLowerCase()}_${base}.${resolvePublicDocumentExtension(doc)}`;
}

function triggerAnchorDownload(href: string, fileName: string): void {
  const link = document.createElement("a");

  link.href = href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Open or download a directory document.
 *
 * Browser-only: call from event handlers.
 */
export function openPublicDocument(
  doc: PublicDocumentRecord,
): PublicDocumentOpenResult {
  if (doc.driveUrl) {
    window.open(doc.driveUrl, "_blank", "noopener,noreferrer");
    return "link";
  }

  if (doc.fileUrl) {
    triggerAnchorDownload(doc.fileUrl, safeFileName(doc));
    return "download";
  }

  // Placeholder so the page is demoable before real files exist.
  const blob = new Blob([`Placeholder for: ${doc.title} (${doc.id})`], {
    type: "text/plain",
  });
  const url = URL.createObjectURL(blob);

  triggerAnchorDownload(url, safeFileName(doc));
  URL.revokeObjectURL(url);

  return "download";
}

/**
 * Open a document's file in a new tab so the browser's own PDF/image
 * viewer shows it. A new tab is more reliable than an embedded viewer on
 * phones, where card view is the default.
 *
 * Browser-only: call from event handlers. Does nothing without a fileUrl.
 */
export function viewPublicDocument(
  doc: PublicDocumentRecord,
): PublicDocumentOpenResult | null {
  if (!doc.fileUrl) {
    return null;
  }

  window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
  return "link";
}
