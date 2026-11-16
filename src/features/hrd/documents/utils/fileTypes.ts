// src/features/hrd/documents/utils/fileTypes.ts

/**
 * What kind of file a format label stands for.
 *
 * Drives the badge colour (see FILE_TYPE_TONES) and keeps one source of
 * truth for which extensions count as an image.
 */
export type FileTypeCategory =
  | "pdf"
  | "document"
  | "image"
  | "spreadsheet"
  | "presentation"
  | "archive"
  | "audio"
  | "video"
  | "code"
  | "other";

/**
 * Badge colour: a MUI palette role, or "neutral" for unrecognised formats.
 */
export type FileTypeTone =
  | "primary"
  | "secondary"
  | "info"
  | "warning"
  | "success"
  | "error"
  | "neutral";

/**
 * Maps each file type category to its corresponding badge tone.
 */
export const FILE_TYPE_TONES: Record<FileTypeCategory, FileTypeTone> = {
  pdf: "primary", // Standard red tone for PDFs
  document: "secondary", // Blue tone for Word/Text docs
  spreadsheet: "success", // Green tone for Excel/Sheets
  presentation: "error", // Orange/Amber tone for PowerPoint
  image: "warning", // Light blue/Cyan tone for images
  audio: "info", // Purple tone for audio files
  video: "info", // Matching purple tone for video/media files
  code: "secondary", // Darker blue/neutral primary for development files
  archive: "neutral", // Gray/Neutral tone for compressed archives
  other: "neutral", // Default gray/Neutral tone for unrecognized formats
};

/**
 * Image formats every browser can display in a tab or an <img>. The View
 * action is limited to these (plus PDF); see documentActions.ts.
 */
export const BROWSER_VIEWABLE_IMAGE_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "avif",
  "bmp",
  "svg",
] as const;

/**
 * Extensions per category. Anything not listed is "other" (neutral).
 *
 * Add an extension here to colour it; a presentation format such as pptx
 * is deliberately not listed and stays neutral.
 */
export const FILE_TYPE_EXTENSIONS: Readonly<
  Record<Exclude<FileTypeCategory, "other">, readonly string[]>
> = {
  pdf: ["pdf"],
  document: [
    "doc",
    "docx",
    "docm",
    "dot",
    "dotx",
    "dotm",
    "docb",
    "odt",
    "rtf",
    "wbk",
    "asd",
  ],
  // csv is plain text, but it is opened as a spreadsheet; move it to
  // "other" if you would rather it stay neutral.
  spreadsheet: [
    "xls",
    "xlsx",
    "xlsm",
    "xlsb",
    "xltx",
    "xltm",
    "ods",
    "csv",
    "xlam",
    "xla",
    "xlm",
    "xlw",
    "xlk",
  ],
  presentation: [
    "ppt",
    "pptx",
    "pptm",
    "pot",
    "potx",
    "potm",
    "pps",
    "ppsx",
    "ppsm",
    "odp",
  ],
  image: [
    ...BROWSER_VIEWABLE_IMAGE_EXTENSIONS,
    "tif",
    "tiff",
    "heic",
    "heif",
    "ico",
  ],
  archive: ["zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"],
  audio: ["mp3", "wav", "wma", "aac", "ogg", "flac", "m4a", "opus"],
  video: [
    "mp4",
    "mkv",
    "avi",
    "mov",
    "wmv",
    "flv",
    "webm",
    "m4v",
    "mpeg",
    "mpg",
  ],
  code: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "html",
    "css",
    "py",
    "java",
    "cpp",
    "c",
    "cs",
    "php",
    "rb",
    "go",
    "rs",
    "json",
    "yaml",
    "yml",
    "sh",
    "sql",
  ],
};

/**
 * Generic labels that are not extensions but clearly name a category,
 * e.g. fileTypes: ["Word", "Excel"].
 */
const FILE_TYPE_ALIASES: Readonly<Record<string, FileTypeCategory>> = {
  word: "document",
  excel: "spreadsheet",
  image: "image",
  archive: "archive",
  compressed: "archive",
};

/**
 * Lower-case, trimmed, without a leading dot: " .PDF " -> "pdf".
 */
export function normalizeFileType(type: string): string {
  return type.trim().toLowerCase().replace(/^\./, "");
}

const CATEGORY_BY_LABEL: ReadonlyMap<string, FileTypeCategory> = new Map<
  string,
  FileTypeCategory
>([
  ...(
    Object.entries(FILE_TYPE_EXTENSIONS) as [
      Exclude<FileTypeCategory, "other">,
      readonly string[],
    ][]
  ).flatMap(([category, extensions]) =>
    extensions.map((extension): [string, FileTypeCategory] => [
      extension,
      category,
    ]),
  ),
  ...Object.entries(FILE_TYPE_ALIASES),
]);

export function getFileTypeCategory(type: string): FileTypeCategory {
  return CATEGORY_BY_LABEL.get(normalizeFileType(type)) ?? "other";
}

export function getFileTypeTone(type: string): FileTypeTone {
  return FILE_TYPE_TONES[getFileTypeCategory(type)];
}

const VIEWABLE_IMAGE_SET: ReadonlySet<string> = new Set(
  BROWSER_VIEWABLE_IMAGE_EXTENSIONS,
);

export function isBrowserViewableImageExtension(extension: string): boolean {
  return VIEWABLE_IMAGE_SET.has(normalizeFileType(extension));
}
