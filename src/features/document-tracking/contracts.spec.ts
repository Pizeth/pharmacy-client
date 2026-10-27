import { buildTrackingQuery, trackingUrl } from "./api";
import {
  detailSchema,
  handlerOptionLabel,
  progressInputSchema,
} from "./contracts";
import { fromLocalDate, toLocalDate } from "./DocumentForm";
import { trackingRecord } from "./tracking.test-fixtures";
it("converts table filters and pagination to the shared server query contract", () => {
  expect(
    buildTrackingQuery(
      2,
      25,
      "  request  ",
      [
        { id: "assignedToId", value: "2" },
        { id: "status", value: "ACTIVE" },
        { id: "title", value: "leave" },
        { id: "priority", value: "" },
      ],
      [{ id: "receivedAt", desc: true }],
    ),
  ).toEqual({
    page: 3,
    pageSize: 25,
    search: { term: "request" },
    filters: [
      { field: "assignedToId", operator: "equals", value: 2 },
      { field: "status", operator: "equals", value: "ACTIVE" },
      { field: "title", operator: "contains", value: "leave" },
    ],
    sorting: [{ field: "receivedAt", direction: "desc" }],
  });
});
it("accepts real detail responses but rejects unsafe file URLs", () => {
  expect(detailSchema.safeParse(trackingRecord).success).toBe(true);
  expect(
    detailSchema.safeParse({
      ...trackingRecord,
      attachments: [
        {
          id: "file",
          name: "Unsafe",
          url: "javascript:alert(1)",
          kind: "INCOMING",
          createdAt: trackingRecord.createdAt,
        },
      ],
    }).success,
  ).toBe(false);
});
it.each(["RETURN", "HOLD", "CANCEL", "COMMENT"])(
  "requires an explanatory note for %s",
  (action) =>
    expect(
      progressInputSchema.safeParse({
        version: 3,
        action,
        note: " ",
        targetPosition: 0,
      }).success,
    ).toBe(false),
);
it("uses Cambodia time independently of the browser timezone", () => {
  expect(toLocalDate("2026-10-20T01:00:00.000Z")).toBe("2026-10-20T08:00");
  expect(fromLocalDate("2026-10-20T08:00")).toBe("2026-10-20T01:00:00.000Z");
  expect(fromLocalDate("")).toBeNull();
});
it("addresses the versioned tracking endpoint", () =>
  expect(trackingUrl("/metadata")).toMatch(
    /\/api\/v1\/document-tracking\/metadata$/,
  ));

it("uses HR work identity to distinguish handlers without requiring a profile", () => {
  expect(
    handlerOptionLabel({
      id: 1,
      name: "Account",
      profileName: "Employee Name",
      positionTitle: "Document officer",
      departmentName: "Specialist office",
    }),
  ).toBe("Employee Name · Document officer · Specialist office");
  expect(handlerOptionLabel({ id: 1, name: "Admin" })).toBe("Admin");
});
