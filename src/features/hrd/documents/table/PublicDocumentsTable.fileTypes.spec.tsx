import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { PublicDocumentsTable } from "./PublicDocumentsTable";

jest.mock("../data/publicDocuments", () => ({
  ...jest.requireActual("../data/publicDocuments"),
  PUBLIC_DOCUMENTS: [
    {
      id: "T-1",
      title: "Multi format form",
      category: "x",
      fileSize: "1 MB",
      lastUpdated: "2026-01-01",
      fileTypes: ["PDF", "DOCX"],
      description: "Published as PDF and Word",
      driveUrl: "https://drive.google.com/drive/folders/multi",
    },
    {
      id: "T-2",
      title: "Single format form",
      category: "x",
      fileSize: "2 MB",
      lastUpdated: "2026-01-02",
      fileTypes: ["PDF"],
      description: "Published as PDF only",
      driveUrl: "https://drive.google.com/drive/folders/single",
    },
  ],
}));

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

function getRow(container: HTMLElement, id: string): HTMLElement {
  const row = container.querySelector<HTMLElement>(
    `tbody [data-row-id="${id}"]`,
  );

  if (!row) {
    throw new Error(`Row ${id} not rendered.`);
  }

  return row;
}

describe("PublicDocumentsTable file types", () => {
  beforeEach(() => {
    window.open = jest.fn();
  });

  it("shows one badge per file type", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <PublicDocumentsTable />
      </ThemeProvider>,
    );

    const multi = within(getRow(container, "T-1"));
    const single = within(getRow(container, "T-2"));

    expect(multi.getByText("PDF")).toBeVisible();
    expect(multi.getByText("DOCX")).toBeVisible();
    expect(single.getByText("PDF")).toBeVisible();
    expect(single.queryByText("DOCX")).toBeNull();
  });

  it("opens the document's Drive link from the download button", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <PublicDocumentsTable />
      </ThemeProvider>,
    );

    const row = within(getRow(container, "T-1"));

    fireEvent.click(row.getByRole("button"));

    expect(window.open).toHaveBeenCalledWith(
      "https://drive.google.com/drive/folders/multi",
      "_blank",
      "noopener,noreferrer",
    );
  });
});
