import {
  canDownloadPublicDocument,
  canViewPublicDocument,
  createPublicDocumentActions,
  getPublicDocumentViewKind,
  isPublicDocumentActionAvailable,
} from "./documentActions";
import type { PublicDocumentRecord } from "../../types/publicDocuments.types";

const base: PublicDocumentRecord = {
  id: "DOC-1",
  title: "Sample",
  category: "x",
  fileSize: "1 MB",
  lastUpdated: "2026-01-01",
  fileTypes: ["PDF"],
  description: "Sample",
};

const drive: PublicDocumentRecord = {
  ...base,
  driveUrl: "https://drive.google.com/drive/folders/abc",
};
const pdfFile: PublicDocumentRecord = { ...base, fileUrl: "/files/a.pdf" };
const imageFile: PublicDocumentRecord = {
  ...base,
  fileTypes: ["PNG"],
  fileUrl: "/files/a.PNG",
};
const wordFile: PublicDocumentRecord = {
  ...base,
  fileTypes: ["DOCX"],
  fileUrl: "/files/a.docx",
};

describe("getPublicDocumentViewKind", () => {
  it("recognises PDFs and images from the file's own extension", () => {
    expect(getPublicDocumentViewKind(pdfFile)).toBe("pdf");
    expect(getPublicDocumentViewKind(imageFile)).toBe("image");

    for (const ext of ["jpg", "jpeg", "gif", "webp", "avif", "svg", "bmp"]) {
      expect(
        getPublicDocumentViewKind({ ...base, fileUrl: `/f/x.${ext}` }),
      ).toBe("image");
    }
  });

  it("rejects other file types, even when a listed format is a PDF", () => {
    expect(getPublicDocumentViewKind(wordFile)).toBeNull();
    // Listed as PDF + DOCX, but the file itself is a .docx.
    expect(
      getPublicDocumentViewKind({
        ...wordFile,
        fileTypes: ["PDF", "DOCX"],
      }),
    ).toBeNull();
  });

  it("falls back to the primary listed format when the URL has no extension", () => {
    expect(
      getPublicDocumentViewKind({ ...base, fileUrl: "/api/files/12" }),
    ).toBe("pdf");
    expect(
      getPublicDocumentViewKind({
        ...base,
        fileTypes: ["DOCX"],
        fileUrl: "/api/files/12",
      }),
    ).toBeNull();
  });
});

describe("default visibility rules", () => {
  it("offers Download for Drive links and for files, but not for neither", () => {
    expect(canDownloadPublicDocument(drive)).toBe(true);
    expect(canDownloadPublicDocument(pdfFile)).toBe(true);
    expect(canDownloadPublicDocument(wordFile)).toBe(true);
    expect(canDownloadPublicDocument(base)).toBe(false);
  });

  it("offers View only for PDF/image files, never for Drive links", () => {
    expect(canViewPublicDocument(pdfFile)).toBe(true);
    expect(canViewPublicDocument(imageFile)).toBe(true);
    expect(canViewPublicDocument(wordFile)).toBe(false);
    // A Drive document listed as a PDF is still a link, not a file.
    expect(canViewPublicDocument(drive)).toBe(false);
  });
});

describe("isPublicDocumentActionAvailable", () => {
  it("uses the default rule when nothing is configured", () => {
    expect(isPublicDocumentActionAvailable("view", pdfFile)).toBe(true);
    expect(isPublicDocumentActionAvailable("view", drive)).toBe(false);
  });

  it("lets a boolean force an action on or off", () => {
    expect(
      isPublicDocumentActionAvailable("view", pdfFile, { view: false }),
    ).toBe(false);
    expect(isPublicDocumentActionAvailable("view", drive, { view: true })).toBe(
      true,
    );
  });

  it("lets a function replace the rule", () => {
    const config = { download: (doc: PublicDocumentRecord) => doc.id === "ok" };

    expect(
      isPublicDocumentActionAvailable(
        "download",
        { ...drive, id: "ok" },
        config,
      ),
    ).toBe(true);
    expect(isPublicDocumentActionAvailable("download", drive, config)).toBe(
      false,
    );
  });
});

describe("createPublicDocumentActions", () => {
  it("returns View then Download, wired to the handlers", () => {
    const onView = jest.fn();
    const onDownload = jest.fn();
    const actions = createPublicDocumentActions({ onView, onDownload });

    expect(actions.map((action) => action.id)).toEqual(["view", "download"]);

    actions[0].run(pdfFile);
    actions[1].run(drive);

    expect(onView).toHaveBeenCalledWith(pdfFile);
    expect(onDownload).toHaveBeenCalledWith(drive);
  });

  it("applies the visibility config", () => {
    const actions = createPublicDocumentActions(
      { onView: jest.fn(), onDownload: jest.fn() },
      { view: false },
    );

    expect(actions[0].isAvailable(pdfFile)).toBe(false);
    expect(actions[1].isAvailable(pdfFile)).toBe(true);
  });
});
