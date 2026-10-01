import { openPublicDocument } from "./openPublicDocument";
import type { PublicDocumentRecord } from "./types";

const base: PublicDocumentRecord = {
  id: "DOC-1",
  title: "Sample Form & Guide",
  category: "Legal & Civil",
  fileSize: "1 MB",
  lastUpdated: "2026-01-01",
  fileTypes: ["PDF", "DOCX"],
  description: "Sample",
};

describe("openPublicDocument", () => {
  let clickSpy: jest.SpyInstance;
  let lastAnchor: HTMLAnchorElement | undefined;

  beforeEach(() => {
    lastAnchor = undefined;
    clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(function (this: HTMLAnchorElement) {
        lastAnchor = this;
      });

    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      writable: true,
      value: jest.fn(() => "blob:placeholder"),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      writable: true,
      value: jest.fn(),
    });
    window.open = jest.fn();
  });

  afterEach(() => {
    clickSpy.mockRestore();
  });

  it("opens a Drive link in a new tab without opener access", () => {
    const result = openPublicDocument({
      ...base,
      driveUrl: "https://drive.google.com/file/d/abc/view",
    });

    expect(result).toBe("link");
    expect(window.open).toHaveBeenCalledWith(
      "https://drive.google.com/file/d/abc/view",
      "_blank",
      "noopener,noreferrer",
    );
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it("downloads a static file using the extension of its own URL", () => {
    const result = openPublicDocument({
      ...base,
      fileUrl: "/files/sample.docx?v=3#top",
    });

    expect(result).toBe("download");
    expect(window.open).not.toHaveBeenCalled();
    expect(lastAnchor?.getAttribute("href")).toBe("/files/sample.docx?v=3#top");
    // Primary type is PDF, but the URL points at a .docx file.
    expect(lastAnchor?.download).toBe("doc-1_sample_form_guide.docx");
  });

  it("falls back to the primary file type when the URL has no extension", () => {
    openPublicDocument({ ...base, fileUrl: "/files/download" });

    expect(lastAnchor?.download).toBe("doc-1_sample_form_guide.pdf");
  });

  it("names a generated placeholder after the primary file type", () => {
    const result = openPublicDocument(base);

    expect(result).toBe("download");
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(lastAnchor?.download).toBe("doc-1_sample_form_guide.pdf");
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:placeholder");
  });

  it("prefers driveUrl over fileUrl", () => {
    const result = openPublicDocument({
      ...base,
      driveUrl: "https://drive.google.com/x",
      fileUrl: "/files/sample.pdf",
    });

    expect(result).toBe("link");
    expect(clickSpy).not.toHaveBeenCalled();
  });
});
