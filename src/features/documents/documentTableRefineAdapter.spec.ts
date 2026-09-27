import type { DataTableServerQueryState } from "@/components/DataTable";

import {
  DOCUMENT_REFINE_RESOURCE,
  documentRefineDataTableAdapter,
} from "./documentTableRefineAdapter";
import { DOCUMENT_COLUMN_IDS } from "./types";

const query: DataTableServerQueryState = {
  pagination: {
    pageIndex: 1,
    pageSize: 25,
  },
  sorting: [
    {
      id: DOCUMENT_COLUMN_IDS.createdAt,
      desc: true,
    },
    {
      id: DOCUMENT_COLUMN_IDS.title,
      desc: false,
    },
  ],
  columnFilters: [
    {
      id: DOCUMENT_COLUMN_IDS.documentNumber,
      value: "  0012  ",
    },
    {
      id: DOCUMENT_COLUMN_IDS.status,
      value: "ប្រញ៉ាប់",
    },
    {
      id: DOCUMENT_COLUMN_IDS.processingDays,
      value: [2, 8],
    },
    {
      id: DOCUMENT_COLUMN_IDS.isEnabled,
      value: true,
    },
  ],
  globalFilter: "  budget  ",
};

describe("documentRefineDataTableAdapter", () => {
  it("maps the Document semantic contract into Refine list parameters", () => {
    expect(
      documentRefineDataTableAdapter.createRequest(query),
    ).toEqual({
      resource: DOCUMENT_REFINE_RESOURCE,
      pagination: {
        currentPage: 2,
        pageSize: 25,
        mode: "server",
      },
      sorters: [
        {
          field: "createdAt",
          order: "desc",
        },
        {
          field: "title",
          order: "asc",
        },
      ],
      filters: [
        {
          field: "documentNumber",
          operator: "contains",
          value: "0012",
        },
        {
          field: "status",
          operator: "eq",
          value: "ប្រញ៉ាប់",
        },
        {
          field: "processingDays",
          operator: "gte",
          value: 2,
        },
        {
          field: "processingDays",
          operator: "lte",
          value: 8,
        },
        {
          field: "isEnabled",
          operator: "eq",
          value: true,
        },
        {
          operator: "or",
          value: [
            {
              field: "documentNumber",
              operator: "contains",
              value: "budget",
            },
            {
              field: "title",
              operator: "contains",
              value: "budget",
            },
            {
              field: "description",
              operator: "contains",
              value: "budget",
            },
          ],
        },
      ],
    });
  });

  it("normalizes a Refine response back into the generic DataTable result", () => {
    const row = {
      id: 26,
      documentNumber: "DOC-0026",
      title: "Document 26",
      description: "Routine circulation 26",
      status: "ប្រញ៉ាប់",
      processingDays: 2,
      isEnabled: true,
      createdAt: "2026-01-26T00:00:00.000Z",
    };

    expect(
      documentRefineDataTableAdapter.readResponse(
        {
          data: [row],
          total: 51,
        },
        query,
      ),
    ).toEqual({
      rows: [row],
      pagination: {
        pageIndex: 1,
        pageSize: 25,
        rowCount: 51,
        pageCount: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      },
    });
  });
});
