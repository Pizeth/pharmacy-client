"use client";
import { ResourceDetailPanel, ResourceDetailSection, ResourceDetailFacts } from "@/components/Tables/ResourceDetailPanel";
import AttachFileOutlined from "@mui/icons-material/AttachFileOutlined";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Link, Typography } from "@mui/material";
import AssignmentIndOutlined from "@mui/icons-material/AssignmentIndOutlined";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import UndoOutlined from "@mui/icons-material/UndoOutlined";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import RouteOutlined from "@mui/icons-material/RouteOutlined";
import { ResourceTableLoading } from "@/components/Tables/ResourceTableLoading";
import { trackingApi } from "./api";
import {
  activeStep,
  documentReference,
  type DocumentDetail as Detail,
} from "./contracts";
import {
  DocumentProgress,
  formatTrackingDate,
  processingDays,
} from "./DocumentProgress";
import * as S from "./styles";

import { documentEventLabels } from "./documentEventLabels";
export function DocumentDetailContent({
  record,
  compact = false,
  onProgress,
  onAttachment,
}: {
  readonly record: Detail;
  readonly compact?: boolean;
  readonly onProgress?: () => void;
  readonly onAttachment?: () => void;
}) {
  const current = activeStep(record);
  const facts = [
    ["Reference", documentReference(record)],
    ["Current handler", current?.assignedTo?.name ?? "Not assigned"],
    ["Current office", current?.departmentName ?? "Not assigned"],
    ["Responsible office", record.responsibleDepartmentName ?? "—"],
    ["Category", record.category.name],
    ["Document type", record.type.name],
    ["Subtype", record.subtype ?? "—"],
    ["Priority", record.priority === "URGENT" ? "Urgent" : "Normal"],
    ["Received", formatTrackingDate(record.receivedAt)],
    ["Due", formatTrackingDate(record.dueAt)],
    ["Elapsed", `${processingDays(record)} days`],
    ["Incoming number", record.incomingNumber ?? "—"],
    ["Outgoing number", record.outgoingNumber ?? "—"],
    ["Stamped", formatTrackingDate(record.stampedAt)],
    ["Dispatched", formatTrackingDate(record.dispatchedAt)],
    ["Cabinet / storage", record.storageLocation?.name ?? "—"],
    ["Chronological code", record.chronologicalCode ?? "—"],
    [
      "Archive sequence",
      record.archiveSequence == null ? "—" : String(record.archiveSequence),
    ],
  ];
  return (
    <ResourceDetailPanel view={compact ? "card" : "table"}>
      <ResourceDetailSection title="Handling progress" icon={<RouteOutlined />}><DocumentProgress record={record} compact={compact} />
      {record.archivedAt && (
        <Alert severity="info">
          This record was archived. Its handling history is preserved.
        </Alert>
      )}
      {record.permissions.canUpdateProgress && onProgress && (
        <S.Actions>
          <Button startIcon={<RouteOutlined />} onClick={onProgress}>
            Update progress
          </Button>
          {onAttachment && (
            <Button startIcon={<AttachFileOutlined />} onClick={onAttachment}>
              Add attachment
            </Button>
          )}
        </S.Actions>
      )}
      </ResourceDetailSection>
      <ResourceDetailSection title="Document registration" icon={<DescriptionOutlined />}>
      <ResourceDetailFacts items={facts.map(([label, value]) => ({ label, value }))} />
      {record.notes && <Typography variant="body2">{record.notes}</Typography>}
      </ResourceDetailSection>
        <ResourceDetailSection title="Handling history" icon={<HistoryOutlined />}>
          <S.Timeline>
            {record.events.map((event) => {
              const Icon =
                event.kind === "COMPLETED"
                  ? CheckCircleOutline
                  : event.kind === "RETURNED"
                    ? UndoOutlined
                    : event.kind === "ASSIGNED"
                      ? AssignmentIndOutlined
                      : RouteOutlined;
              return (
                <S.Event key={event.id}>
                  <S.EventIcon data-kind={event.kind}>
                    <Icon aria-hidden="true" />
                  </S.EventIcon>
                  <div>
                    <S.EventHeading>
                      <Typography variant="subtitle2">
                        {documentEventLabels[event.kind] ?? event.kind}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        component="time"
                        dateTime={event.occurredAt}
                      >
                        {formatTrackingDate(event.occurredAt)}
                      </Typography>
                    </S.EventHeading>
                    <Typography variant="body2">
                      {event.actorName}
                      {event.recipientName ? ` → ${event.recipientName}` : ""}
                    </Typography>
                    {(event.recipientOfficeName ||
                      event.recipientPositionTitle ||
                      event.recipientMinistryName) && (
                      <Typography variant="body2" color="text.secondary">
                        {[
                          event.recipientPositionTitle,
                          event.recipientOfficeName,
                          event.recipientMinistryName,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </Typography>
                    )}
                    {event.toStage && (
                      <Typography variant="caption" color="text.secondary">
                        {event.fromStage && event.fromStage !== event.toStage
                          ? `${event.fromStage} → `
                          : ""}
                        {event.toStage}
                      </Typography>
                    )}
                    {event.note && (
                      <Typography variant="body2">{event.note}</Typography>
                    )}
                  </div>
                </S.Event>
              );
            })}
          </S.Timeline>
        </ResourceDetailSection>
        <ResourceDetailSection title="Document attachments" icon={<AttachFileOutlined />}>
          {record.attachments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No attachments recorded.
            </Typography>
          ) : (
            <ul>
              {record.attachments.map((file) => (
                <li key={file.id}>
                  <Link
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.name}
                  </Link>
                  <Typography variant="caption" color="text.secondary">
                    {" "}
                    · {file.kind.toLowerCase()}
                  </Typography>
                </li>
              ))}
            </ul>
          )}
        </ResourceDetailSection>
    </ResourceDetailPanel>
  );
}
export function DocumentDetail({
  id,
  compact = false,
  onProgress,
  onAttachment,
}: {
  readonly id: string;
  readonly compact?: boolean;
  readonly onProgress?: () => void;
  readonly onAttachment?: () => void;
}) {
  const query = useQuery({
    queryKey: ["document-tracking", "detail", id],
    queryFn: ({ signal }) => trackingApi.get(id, signal),
    refetchInterval: 15_000,
  });
  if (query.isLoading)
    return <ResourceTableLoading message="Loading document tracking…" />;
  if (query.error)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => query.refetch()}>Retry</Button>}
      >
        {query.error.message}
      </Alert>
    );
  return query.data ? (
    <DocumentDetailContent
      record={query.data}
      compact={compact}
      onProgress={onProgress}
      onAttachment={onAttachment}
    />
  ) : null;
}
