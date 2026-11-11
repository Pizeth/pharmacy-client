export type AttachmentKind = "INCOMING" | "OUTGOING" | "SUPPORTING";
export class AttachmentValidationError extends Error {
  constructor(readonly field: "name" | "file" | "url", message: string) {
    super(message);
  }
}

export function getAttachmentDraft(values: { source: string; name: string; url: string; kind: AttachmentKind }, file: File | null, fallbackName = "") {
  const name = values.name.trim() || fallbackName.trim();
  if (!name) throw new AttachmentValidationError("name", "Give the attachment a name.");
  if (name.length > 255) throw new AttachmentValidationError("name", "Attachment names must be 255 characters or fewer.");
  if (values.source === "upload") {
    if (!file || !file.size) throw new AttachmentValidationError("file", "Choose a non-empty file to upload.");
    if (file.size > 32 * 1024 * 1024) throw new AttachmentValidationError("file", "Files must be 32 MB or smaller.");
    return { source: "upload" as const, name, kind: values.kind, file };
  }
  const url = values.url.trim();
  try {
    const parsed = new URL(url);
    if (values.source !== "link" || !["http:", "https:"].includes(parsed.protocol) || url.length > 2048) throw new Error();
  } catch { throw new AttachmentValidationError("url", "Enter an HTTP or HTTPS file URL."); }
  return { source: "link" as const, name, kind: values.kind, url };
}

export function isAttachmentDraftValid(...args: Parameters<typeof getAttachmentDraft>) {
  try {
    getAttachmentDraft(...args);
    return true;
  } catch (error) {
    if (!(error instanceof AttachmentValidationError)) throw error;
    return false;
  }
}
