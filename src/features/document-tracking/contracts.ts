import { z } from "zod";

export const lifecycleSchema = z.enum([
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
]);
export const prioritySchema = z.enum(["NORMAL", "URGENT"]);
export const actionSchema = z.enum([
  "FORWARD",
  "RETURN",
  "ASSIGN",
  "HOLD",
  "RESUME",
  "COMMENT",
  "CANCEL",
]);
export const optionSchema = z.object({ id: z.string(), name: z.string() });
export const handlerSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  image: z.string().nullish(),
  profileName: z.string().nullish(),
  positionTitle: z.string().nullish(),
  departmentId: z.number().int().nullish(),
  departmentName: z.string().nullish(),
  ministryName: z.string().nullish(),
});
export const departmentSchema = z.object({
  id: z.number().int(),
  name: z.string(),
});
export const stepSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  nameKh: z.string(),
  position: z.number().int(),
  status: z.enum(["PENDING", "ACTIVE", "COMPLETED"]),
  assignedToId: z.number().nullable(),
  assignedTo: handlerSchema.nullable(),
  departmentId: z.number().nullable(),
  departmentName: z.string().nullable(),
  startedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
});
export const documentSchema = z.object({
  id: z.string(),
  registrationNumber: z.number().int(),
  title: z.string(),
  categoryId: z.string(),
  typeId: z.string(),
  category: optionSchema,
  type: optionSchema,
  subtype: z.string().nullable(),
  priority: prioritySchema,
  status: lifecycleSchema,
  incomingNumber: z.string().nullable(),
  outgoingNumber: z.string().nullable(),
  receivedAt: z.string(),
  dueAt: z.string().nullable(),
  stampedAt: z.string().nullable(),
  dispatchedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
  responsibleDepartmentId: z.number().nullable(),
  responsibleDepartmentName: z.string().nullable(),
  storageLocation: z
    .object({ id: z.string(), code: z.string(), name: z.string() })
    .nullable(),
  chronologicalCode: z.string().nullable(),
  archiveSequence: z.number().int().nullable(),
  notes: z.string().nullable(),
  version: z.number().int().positive(),
  createdAt: z.string(),
  updatedAt: z.string(),
  archivedAt: z.string().nullable(),
  steps: z.array(stepSchema),
  permissions: z.object({
    canManage: z.boolean(),
    canUpdateProgress: z.boolean(),
  }),
});
export const eventSchema = z.object({
  id: z.string(),
  sequence: z.number().int(),
  kind: z.string(),
  actorName: z.string(),
  recipientName: z.string().nullable(),
  recipientOfficeName: z.string().nullish(),
  recipientPositionTitle: z.string().nullish(),
  recipientMinistryName: z.string().nullish(),
  fromStage: z.string().nullable(),
  toStage: z.string().nullable(),
  note: z.string().nullable(),
  occurredAt: z.string(),
});
export const attachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.url({ protocol: /^https?$/ }),
  kind: z.enum(["INCOMING", "OUTGOING", "SUPPORTING"]),
  createdAt: z.string(),
});
export const detailSchema = documentSchema.extend({
  events: z.array(eventSchema),
  attachments: z.array(attachmentSchema),
});
export const metadataSchema = z.object({
  actor: handlerSchema.extend({ isAdmin: z.boolean() }),
  categories: z.array(optionSchema),
  types: z.array(optionSchema),
  handlers: z.array(handlerSchema),
  departments: z.array(departmentSchema),
  workflow: z.object({
    id: z.string(),
    name: z.string(),
    steps: z.array(
      z.object({
        key: z.string(),
        name: z.string(),
        nameKh: z.string(),
        position: z.number(),
      }),
    ),
  }),
});
const optionalText = (max: number) => z.string().trim().max(max).nullable();
export const documentInputSchema = z.object({
  title: z.string().trim().min(1, "Document title is required.").max(500),
  categoryId: z.uuid(),
  typeId: z.uuid(),
  subtype: optionalText(160),
  priority: prioritySchema,
  incomingNumber: optionalText(120),
  outgoingNumber: optionalText(120),
  receivedAt: z.iso.datetime({ offset: true }),
  dueAt: z.iso.datetime({ offset: true }).nullable(),
  responsibleDepartmentId: z.number().int().positive().nullable(),
  assignedToId: z.number().int().positive().nullable(),
  storageLocationCode: optionalText(100),
  chronologicalCode: optionalText(100),
  archiveSequence: z.number().int().positive().nullable(),
  notes: optionalText(4000),
});
export const progressInputSchema = z
  .object({
    version: z.number().int().positive(),
    action: actionSchema,
    note: optionalText(4000),
    assignedToId: z.number().int().positive().nullable().optional(),
    departmentId: z.number().int().positive().nullable().optional(),
    targetPosition: z.number().int().nonnegative().optional(),
    outgoingNumber: optionalText(120).optional(),
    storageLocationCode: optionalText(100).optional(),
    chronologicalCode: optionalText(100).optional(),
    archiveSequence: z.number().int().positive().nullable().optional(),
  })
  .superRefine((value, context) => {
    if (
      ["RETURN", "HOLD", "CANCEL", "COMMENT"].includes(value.action) &&
      !value.note
    )
      context.addIssue({
        code: "custom",
        path: ["note"],
        message: "A reason or comment is required for this action.",
      });
    if (value.action === "RETURN" && value.targetPosition == null)
      context.addIssue({
        code: "custom",
        path: ["targetPosition"],
        message: "Choose an earlier stage.",
      });
  });
export type TrackedDocument = z.infer<typeof documentSchema>;
export type DocumentDetail = z.infer<typeof detailSchema>;
export type TrackingMetadata = z.infer<typeof metadataSchema>;
export type DocumentInput = z.infer<typeof documentInputSchema>;
export type ProgressInput = z.infer<typeof progressInputSchema>;
export type TrackingAction = z.infer<typeof actionSchema>;
export function handlerOptionLabel(handler: z.infer<typeof handlerSchema>) {
  return [
    handler.profileName || handler.name,
    handler.positionTitle,
    handler.departmentName,
  ]
    .filter(Boolean)
    .join(" · ");
}
export const documentReference = (
  record: Pick<TrackedDocument, "registrationNumber">,
) => `DOC-${String(record.registrationNumber).padStart(6, "0")}`;
export const activeStep = (record: Pick<TrackedDocument, "steps">) =>
  record.steps.find((step) => step.status === "ACTIVE");
