// import { fireEvent, render, screen } from "@testing-library/react";

// import { DataTable } from "@/components/DataTable";

// import { DATA_TABLE_EXPANSION_COLUMN_ID } from "@/components/DataTable/mui/columns/expansion";

// import { useMuiDataTable } from "@/components/DataTable/mui/table";

// import { createTranslationKeyColumns } from "../columns";

// import type { TranslationKey } from "../schemas";

// // import { TranslationValuesPanel } from "../translation-values";

// const record: TranslationKey = {
//   id: 31,

//   key: "detail_panel_test",

//   description: "Detail panel fixture",

//   categoryId: 1,

//   createdAt: "2026-09-01T00:00:00.000Z",

//   updatedAt: "2026-09-01T00:00:00.000Z",

//   translationCategory: {
//     id: 1,

//     name: "common",

//     description: null,
//   },

//   translations: [
//     {
//       id: 301,

//       keyId: 31,

//       locale: "en",

//       value: "Detail value",

//       createdAt: "2026-09-01T00:00:00.000Z",

//       updatedAt: "2026-09-01T00:00:00.000Z",
//     },
//   ],
// };

// const columns = createTranslationKeyColumns({
//   categoryFilterOptions: [
//     {
//       label: "common",

//       value: 1,
//     },
//   ],

//   localeFilterOptions: [
//     {
//       label: "English",

//       value: "en",
//     },

//     {
//       label: "Khmer",

//       value: "km",
//     },
//   ],
// });

// function Fixture() {
//   const table = useMuiDataTable({
//     data: [record],

//     columns,

//     getRowId: (row) => String(row.id),

//     getRowCanExpand: () => true,

//     enableColumnPinning: true,

//     initialState: {
//       columnPinning: {
//         start: [DATA_TABLE_EXPANSION_COLUMN_ID],

//         end: [],
//       },
//     },
//   });

//   return (
//     <DataTable
//       table={table}
//       toolbar={false}
//       pagination={false}
//       renderDetailPanel={({ row }) => (
//         <TranslationValuesPanel record={row.original} />
//       )}
//     />
//   );
// }

// describe("TranslationKey translation detail panel", () => {
//   it("uses real TanStack expansion state to show and hide nested translations", () => {
//     render(<Fixture />);

//     const expand = screen.getByRole("button", {
//       name: "Expand details for row 31",
//     });

//     expect(screen.queryByRole("region")).not.toBeInTheDocument();

//     expect(screen.queryByText("Detail value")).not.toBeInTheDocument();

//     fireEvent.click(expand);

//     const region = screen.getByRole("region");

//     expect(region).toBeInTheDocument();

//     expect(region).toHaveTextContent("Translations · detail_panel_test");

//     expect(region).toHaveTextContent("Detail value");

//     const collapse = screen.getByRole("button", {
//       name: "Collapse details for row 31",
//     });

//     expect(collapse).toHaveAttribute("aria-expanded", "true");

//     fireEvent.click(collapse);

//     expect(screen.queryByRole("region")).not.toBeInTheDocument();
//   });

//   it("pins the translation-detail utility column to logical start", () => {
//     render(<Fixture />);

//     const expansionCell = document.querySelector(
//       `[data-column-id="${DATA_TABLE_EXPANSION_COLUMN_ID}"]`,
//     );

//     expect(expansionCell).not.toBeNull();

//     expect(expansionCell).toHaveAttribute("data-pinned", "start");
//   });
// });
