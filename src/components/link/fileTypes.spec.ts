import {
  BROWSER_VIEWABLE_IMAGE_EXTENSIONS,
  FILE_TYPE_EXTENSIONS,
  FILE_TYPE_TONES,
  getFileTypeCategory,
  getFileTypeTone,
  isBrowserViewableImageExtension,
  normalizeFileType,
} from "./fileTypes";

describe("badge colours by kind of file", () => {
  it("uses the requested palette role for each kind", () => {
    expect(FILE_TYPE_TONES).toEqual({
      pdf: "primary",
      document: "secondary",
      image: "warning",
      spreadsheet: "success",
      archive: "neutral",
      other: "neutral",
    });
  });

  it.each([
    ["PDF", "primary"],
    ["DOCX", "secondary"],
    ["DOC", "secondary"],
    ["PNG", "warning"],
    ["JPG", "warning"],
    ["XLSX", "success"],
    ["XLS", "success"],
    ["ZIP", "neutral"],
    ["RAR", "neutral"],
    ["7Z", "neutral"],
  ])("colours %s as %s", (type, tone) => {
    expect(getFileTypeTone(type)).toBe(tone);
  });

  it("leaves unrecognised formats neutral", () => {
    expect(getFileTypeTone("PPTX")).toBe("neutral");
    expect(getFileTypeTone("TXT")).toBe("neutral");
    expect(getFileTypeTone("")).toBe("neutral");
  });
});

describe("getFileTypeCategory", () => {
  it("ignores case, padding and a leading dot", () => {
    expect(getFileTypeCategory(" .PDF ")).toBe("pdf");
    expect(getFileTypeCategory(".Docx")).toBe("document");
    expect(getFileTypeCategory("jPeG")).toBe("image");
  });

  it("understands generic labels that name a category", () => {
    expect(getFileTypeCategory("Word")).toBe("document");
    expect(getFileTypeCategory("Excel")).toBe("spreadsheet");
    expect(getFileTypeCategory("Image")).toBe("image");
    expect(getFileTypeCategory("Archive")).toBe("archive");
    expect(getFileTypeCategory("Compressed")).toBe("archive");
  });

  it("covers every compression format the directory is likely to hold", () => {
    for (const ext of ["zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"]) {
      expect(getFileTypeCategory(ext)).toBe("archive");
    }
  });

  it("never lists one extension under two categories", () => {
    const seen = new Map<string, string>();

    for (const [category, extensions] of Object.entries(FILE_TYPE_EXTENSIONS)) {
      for (const extension of extensions) {
        expect(seen.get(extension)).toBeUndefined();
        seen.set(extension, category);
      }
    }
  });
});

describe("normalizeFileType", () => {
  it("lower-cases, trims and drops one leading dot", () => {
    expect(normalizeFileType("  .PDF ")).toBe("pdf");
    expect(normalizeFileType("..x")).toBe(".x");
  });
});

describe("isBrowserViewableImageExtension", () => {
  it("accepts every browser-displayable image format", () => {
    for (const ext of BROWSER_VIEWABLE_IMAGE_EXTENSIONS) {
      expect(isBrowserViewableImageExtension(ext)).toBe(true);
      expect(isBrowserViewableImageExtension(ext.toUpperCase())).toBe(true);
    }
  });

  it("rejects images a browser cannot show, even though they are coloured as images", () => {
    for (const ext of ["tif", "tiff", "heic", "heif", "ico"]) {
      expect(getFileTypeCategory(ext)).toBe("image");
      expect(isBrowserViewableImageExtension(ext)).toBe(false);
    }
  });

  it("rejects non-images", () => {
    expect(isBrowserViewableImageExtension("pdf")).toBe(false);
    expect(isBrowserViewableImageExtension("zip")).toBe(false);
  });
});
