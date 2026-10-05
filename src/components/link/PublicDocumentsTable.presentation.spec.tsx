import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MsgUtils } from "@/utils/msgUtils";
import { PublicDocumentsTable } from "./PublicDocumentsTable";

/**
 * 30 generated documents:
 *
 * - D-01  PDF file      -> View + Download
 * - D-02  PNG file      -> View + Download
 * - D-03  DOCX file     -> Download only (not viewable)
 * - D-04+ Drive folder  -> Download only (links are never viewed)
 *
 * D-01..D-20 share one category, D-21..D-30 another.
 */
jest.mock("./data", () => {
  const actual = jest.requireActual("./data");
  const [, categoryA, categoryB] = actual.PUBLIC_DOCUMENT_CATEGORIES;

  const documents = Array.from({ length: 30 }, (_, index) => {
    const n = index + 1;
    const id = `D-${String(n).padStart(2, "0")}`;
    const base = {
      id,
      title: `Document ${String(n).padStart(2, "0")}`,
      category: n <= 20 ? categoryA : categoryB,
      fileSize: "1 MB",
      lastUpdated: "2026-01-01",
      description: `Description ${n}`,
    };

    if (n === 1) {
      return { ...base, fileTypes: ["PDF"], fileUrl: "/files/one.pdf" };
    }
    if (n === 2) {
      return { ...base, fileTypes: ["PNG"], fileUrl: "/files/two.png" };
    }
    if (n === 3) {
      return { ...base, fileTypes: ["DOCX"], fileUrl: "/files/three.docx" };
    }

    return {
      ...base,
      fileTypes: ["PDF"],
      driveUrl: `https://drive.google.com/drive/folders/${id}`,
    };
  });

  return { ...actual, PUBLIC_DOCUMENTS: documents };
});

const VIEW = "មើលឯកសារ";
const DOWNLOAD = "ទាញយកឯកសារ";

const shadows = {
  neumorphic: "none",
  inset: "none",
  circleWell: "none",
  dataTableCard: "none",
  dataTableInset: "none",
};

const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: { palette: { customShadows: shadows } },
    dark: { palette: { customShadows: shadows } },
  },
});

function mountTable() {
  return render(
    <ThemeProvider theme={theme}>
      <PublicDocumentsTable />
    </ThemeProvider>,
  );
}

function setScreen(size: "small" | "wide"): void {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    // MUI breakpoints.down(...) produces "(max-width:...)" queries.
    matches: size === "small" && /max-width/.test(query),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

function bodyRows(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>("tbody [data-row-id]"),
  );
}

function rowIds(container: HTMLElement): string[] {
  return bodyRows(container).map((row) => row.dataset.rowId ?? "");
}

function rowNumbers(container: HTMLElement): string[] {
  return bodyRows(container).map(
    (row) => row.querySelector("td")?.textContent ?? "",
  );
}

function sequence(from: number, to: number): string[] {
  return Array.from({ length: to - from + 1 }, (_, i) =>
    MsgUtils.toLocaleNumerals(from + i, "km-KH"),
  );
}

describe("PublicDocumentsTable (table presentation)", () => {
  beforeEach(() => {
    setScreen("wide");
    window.open = jest.fn();
    jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);
  });

  it("renders the table with 25 rows per page by default", () => {
    const { container } = mountTable();

    expect(container.querySelector("table")).not.toBeNull();
    expect(bodyRows(container)).toHaveLength(25);
  });

  it("numbers rows sequentially, continuing across pages", () => {
    const { container } = mountTable();

    expect(rowNumbers(container)).toEqual(sequence(1, 25));

    fireEvent.click(screen.getByRole("button", { name: /next page/i }));

    expect(rowIds(container)[0]).toBe("D-26");
    expect(rowNumbers(container)).toEqual(sequence(26, 30));
  });

  it("restarts the numbering for a filtered list", () => {
    const { container } = mountTable();

    // The tab after "All" is the first real category (D-01..D-20).
    fireEvent.click(screen.getAllByRole("tab")[1]);

    expect(bodyRows(container)).toHaveLength(20);
    expect(rowNumbers(container)).toEqual(sequence(1, 20));
  });

  it("keeps the numbers in displayed order when the table is sorted", () => {
    const { container } = mountTable();

    const unsorted = rowIds(container);

    // The category header is the sortable one; click twice to try both
    // directions.
    const categoryHeader = screen.getAllByRole("columnheader")[2];
    const sortTarget = within(categoryHeader).getByText(/\S/);

    fireEvent.click(sortTarget);
    const first = rowIds(container);
    expect(rowNumbers(container)).toEqual(sequence(1, 25));

    fireEvent.click(sortTarget);
    const second = rowIds(container);
    expect(rowNumbers(container)).toEqual(sequence(1, 25));

    // Sorting really did reorder the rows in at least one direction.
    expect([first, second].some((ids) => ids.join() !== unsorted.join())).toBe(
      true,
    );
  });

  it("shows View and Download only where they apply", () => {
    const { container } = mountTable();

    const row = (id: string) =>
      within(container.querySelector<HTMLElement>(`[data-row-id="${id}"]`)!);

    // PDF and image files: both actions.
    for (const id of ["D-01", "D-02"]) {
      expect(row(id).getByRole("button", { name: VIEW })).toBeVisible();
      expect(row(id).getByRole("button", { name: DOWNLOAD })).toBeVisible();
    }

    // Non-viewable file and Drive link: download only.
    for (const id of ["D-03", "D-04"]) {
      expect(row(id).queryByRole("button", { name: VIEW })).toBeNull();
      expect(row(id).getByRole("button", { name: DOWNLOAD })).toBeVisible();
    }
  });

  it("colours each row's file-type badge by kind of file", () => {
    const { container } = mountTable();

    const badgeTone = (id: string) =>
      container
        .querySelector<HTMLElement>(`[data-row-id="${id}"] [data-tone]`)
        ?.getAttribute("data-tone");

    expect(badgeTone("D-01")).toBe("primary"); // PDF
    expect(badgeTone("D-02")).toBe("warning"); // PNG
    expect(badgeTone("D-03")).toBe("secondary"); // DOCX
  });

  it("opens a file in a new tab from View, without downloading it", () => {
    const { container } = mountTable();

    const row = within(
      container.querySelector<HTMLElement>('[data-row-id="D-01"]')!,
    );

    fireEvent.click(row.getByRole("button", { name: VIEW }));

    expect(window.open).toHaveBeenCalledWith(
      "/files/one.pdf",
      "_blank",
      "noopener,noreferrer",
    );
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(HTMLAnchorElement.prototype.click).not.toHaveBeenCalled();
  });

  it("opens a Drive folder once from the row surface or keyboard", () => {
    const { container } = mountTable();
    const row = container.querySelector<HTMLElement>('[data-row-id="D-04"]')!;

    fireEvent.click(within(row).getByText("Document 04"));
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenLastCalledWith(
      "https://drive.google.com/drive/folders/D-04",
      "_blank",
      "noopener,noreferrer",
    );

    fireEvent.keyDown(row, { key: "Enter" });
    fireEvent.keyDown(row, { key: "Enter", repeat: true });
    expect(window.open).toHaveBeenCalledTimes(2);
    expect(HTMLAnchorElement.prototype.click).not.toHaveBeenCalled();
  });

  it("downloads a file from Download, and opens the folder for a Drive link", () => {
    const { container } = mountTable();

    const row = (id: string) =>
      within(container.querySelector<HTMLElement>(`[data-row-id="${id}"]`)!);

    fireEvent.click(row("D-01").getByRole("button", { name: DOWNLOAD }));

    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledTimes(1);
    expect(window.open).not.toHaveBeenCalled();

    fireEvent.click(row("D-04").getByRole("button", { name: DOWNLOAD }));

    expect(window.open).toHaveBeenCalledWith(
      "https://drive.google.com/drive/folders/D-04",
      "_blank",
      "noopener,noreferrer",
    );
  });
});

describe("PublicDocumentsTable (card presentation)", () => {
  beforeEach(() => {
    setScreen("small");
    window.open = jest.fn();
    jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);
  });

  it("defaults to cards on a small screen", () => {
    const { container } = mountTable();

    expect(container.querySelector("table")).toBeNull();
    expect(screen.getByRole("heading", { name: "Document 01" })).toBeVisible();
  });

  it("colours the file-type badges on cards the same way", () => {
    const { container } = mountTable();

    const tones = Array.from(
      container.querySelectorAll<HTMLElement>("[data-tone]"),
    ).map((badge) => `${badge.textContent}:${badge.dataset.tone}`);

    expect(tones).toContain("PDF:primary");
    expect(tones).toContain("PNG:warning");
    expect(tones).toContain("DOCX:secondary");
  });

  it("uses icon-only action buttons named by their labels", () => {
    mountTable();

    const view = screen.getByRole("button", {
      name: new RegExp(`${VIEW}.*D-01`),
    });
    const download = screen.getByRole("button", {
      name: new RegExp(`${DOWNLOAD}.*D-01`),
    });

    // Icon only: no visible text inside the buttons.
    expect(view.textContent).toBe("");
    expect(download.textContent).toBe("");
    expect(view.querySelector("svg")).not.toBeNull();
    expect(download.querySelector("svg")).not.toBeNull();
  });

  it("hides View on cards where it does not apply", () => {
    mountTable();

    // D-04 is a Drive link: no view button, but download remains.
    expect(
      screen.queryByRole("button", { name: new RegExp(`${VIEW}.*D-04`) }),
    ).toBeNull();
    expect(
      screen.getByRole("button", { name: new RegExp(`${DOWNLOAD}.*D-04`) }),
    ).toBeVisible();
  });

  it("runs the same actions as the table", () => {
    mountTable();

    fireEvent.click(
      screen.getByRole("button", { name: new RegExp(`${VIEW}.*D-01`) }),
    );

    expect(window.open).toHaveBeenCalledWith(
      "/files/one.pdf",
      "_blank",
      "noopener,noreferrer",
    );

    fireEvent.click(
      screen.getByRole("button", { name: new RegExp(`${DOWNLOAD}.*D-04`) }),
    );

    expect(window.open).toHaveBeenCalledWith(
      "https://drive.google.com/drive/folders/D-04",
      "_blank",
      "noopener,noreferrer",
    );
  });
});
