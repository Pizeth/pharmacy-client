// src/components/link/openPublicDocument.ts

import type { PublicDocumentRecord } from "./types";

export type PublicDocumentOpenResult = "link" | "download";

function safeFileName(doc: PublicDocumentRecord): string {
  const base = doc.title.toLowerCase().replace(/[^a-z0-9]+/g, "_");

  return `${doc.id.toLowerCase()}_${base}.${doc.fileType.toLowerCase()}`;
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
