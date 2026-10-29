export type AttachmentKind = "INCOMING" | "OUTGOING" | "SUPPORTING";
export function getAttachmentDraft(values: { source: string; name: string; url: string; kind: AttachmentKind }, file: File | null, fallbackName = "") {
  const name = values.name.trim() || fallbackName.trim();
  if (!name) throw new Error("Give the attachment a name.");
  if (name.length > 255) throw new Error("Attachment names must be 255 characters or fewer.");
  if (values.source === "upload") {
    if (!file || !file.size) throw new Error("Choose a non-empty file to upload.");
    if (file.size > 32 * 1024 * 1024) throw new Error("Files must be 32 MB or smaller.");
    return { source: "upload" as const, name, kind: values.kind, file };
  }
  const url = values.url.trim();
  try {
    const parsed = new URL(url);
    if (values.source !== "link" || !["http:", "https:"].includes(parsed.protocol) || url.length > 2048) throw new Error();
  } catch { throw new Error("Enter an HTTP or HTTPS file URL."); }
  return { source: "link" as const, name, kind: values.kind, url };
}
