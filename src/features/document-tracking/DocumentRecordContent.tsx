"use client";
import { ResourceBadge as Chip } from "@/components/Tables/ResourceBadge";
import NextLink from "next/link";
import { Alert, Button, Link, Typography } from "@mui/material";
import { DescriptionOutlined, RouteOutlined, AttachFile, HistoryOutlined, Inventory2Outlined, InfoOutlined, AssignmentIndOutlined, ArchiveOutlined } from "@mui/icons-material";
import { RecordHero, RecordCard, RecordFacts, RecordMetrics } from "@/components/Tables/ResourceRecordPage";
import * as R from "@/components/Tables/resourceRecordStyles";
import { formatAdminDate } from "@/lib/utils/adminDate";
import { activeStep, documentReference, type DocumentDetail } from "./contracts";
import { DocumentProgress, DocumentStatus } from "./DocumentProgress";
import { documentEventLabels } from "./documentEventLabels";

export function DocumentRecordContent({ record, onProgress, onAttachment }: { readonly record: DocumentDetail; readonly onProgress: () => void; readonly onAttachment: () => void }) {
  const current = activeStep(record);
  const stages = record.steps.toSorted((a, b) => a.position - b.position);
  return <>
    <RecordHero eyebrow={`Document ${documentReference(record)}`} title={record.title} description={`${record.category.name} / ${record.type.name}`} icon={<DescriptionOutlined />} badges={<><DocumentStatus status={record.status} /><Chip size="small" color={record.priority === "URGENT" ? "warning" : "default"} label={record.priority === "URGENT" ? "Urgent" : "Normal priority"} />{record.archivedAt && <Chip size="small" label="Archived record" />}</>} />
    <RecordMetrics items={[{ label: "Route stages", value: stages.length }, { label: "Stages completed", value: stages.filter(step => step.status === "COMPLETED").length }, { label: "Attachments", value: record.attachments.length }, { label: "History entries", value: record.events.length }]} />
    {record.archivedAt && <Alert severity="info">This record was archived. Its handling history remains available.</Alert>}
    <R.Layout><R.Main>
      <RecordCard title="Handling route" icon={<RouteOutlined />} description="The document's current position and the responsibility recorded for every stage." action={record.permissions.canUpdateProgress && <Button color="error" startIcon={<RouteOutlined />} onClick={onProgress}>Update progress</Button>}>
        <DocumentProgress record={record} />
        <R.List>{stages.map(step => <R.ListItem key={step.id} data-active={step.status === "ACTIVE" || undefined}>
          <R.Badges><Typography component="h3" variant="subtitle1">{step.position + 1}. {step.name}</Typography><Chip size="small" color={step.status === "COMPLETED" ? "success" : step.status === "ACTIVE" ? "primary" : "default"} label={step.status === "COMPLETED" ? "Completed" : step.status === "ACTIVE" ? "Current stage" : "Pending"} /></R.Badges>
          <Typography variant="body2" lang="km" color="text.secondary">{step.nameKh}</Typography>
          <RecordFacts items={[{ label: "Assigned handler", value: step.assignedTo?.name ?? "Not assigned" }, { label: "Office", value: step.departmentName ?? step.assignedTo?.departmentName ?? "Not assigned" }, { label: "Position", value: step.assignedTo?.positionTitle ?? "Not provided" }, { label: "Ministry", value: step.assignedTo?.ministryName ?? "Not provided" }, { label: "Started", value: step.startedAt ? formatAdminDate(step.startedAt) : "Not started" }, { label: "Completed", value: step.completedAt ? formatAdminDate(step.completedAt) : "Not completed" }]} />
        </R.ListItem>)}</R.List>
      </RecordCard>
      <RecordCard title="Document registration" icon={<DescriptionOutlined />}><RecordFacts items={[{ label: "Reference", value: documentReference(record) }, { label: "Category", value: record.category.name }, { label: "Document type", value: record.type.name }, { label: "Subtype", value: record.subtype ?? "Not specified" }, { label: "Incoming number", value: record.incomingNumber ?? "Not recorded" }, { label: "Outgoing number", value: record.outgoingNumber ?? "Not recorded" }, { label: "Received", value: formatAdminDate(record.receivedAt) }, { label: "Due", value: record.dueAt ? formatAdminDate(record.dueAt) : "No due date" }, { label: "Stamped", value: record.stampedAt ? formatAdminDate(record.stampedAt) : "Not recorded" }, { label: "Dispatched", value: record.dispatchedAt ? formatAdminDate(record.dispatchedAt) : "Not recorded" }]} /></RecordCard>
      <RecordCard title="Attachments" icon={<AttachFile />} description="Original, outgoing and supporting documents with their recorded links." action={record.permissions.canUpdateProgress && <Button startIcon={<AttachFile />} onClick={onAttachment}>Add attachment</Button>}>
        {record.attachments.length ? <R.List>{record.attachments.map(file => <R.ListItem key={file.id}><R.Badges><Typography component="h3" variant="subtitle2">{file.name}</Typography><Chip size="small" label={file.kind.toLowerCase()} color="info" variant="outlined" /></R.Badges><Typography variant="caption" color="text.secondary">Added {formatAdminDate(file.createdAt)}</Typography><Link href={file.url} target="_blank" rel="noopener noreferrer">Open attachment</Link></R.ListItem>)}</R.List> : <Alert severity="info">No attachments recorded.</Alert>}
      </RecordCard>
      <RecordCard title="Handling history" icon={<HistoryOutlined />} description="Recorded events, most recent first. Each entry preserves its actor, destination and note.">
        {record.events.length ? <R.List>{record.events.toSorted((a, b) => b.sequence - a.sequence).map(event => <R.ListItem key={event.id}>
          <R.Badges><Chip size="small" color="info" label={documentEventLabels[event.kind] ?? event.kind} /><Typography component="time" dateTime={event.occurredAt} variant="caption" color="text.secondary">{formatAdminDate(event.occurredAt)}</Typography></R.Badges>
          <RecordFacts items={[{ label: "Handled by", value: event.actorName }, { label: "Recipient", value: event.recipientName ?? "Not recorded" }, { label: "From stage", value: event.fromStage ?? "Not recorded" }, { label: "To stage", value: event.toStage ?? "Not recorded" }, ...(event.recipientOfficeName ? [{ label: "Recipient office", value: event.recipientOfficeName }] : []), ...(event.recipientPositionTitle ? [{ label: "Recipient position", value: event.recipientPositionTitle }] : []), ...(event.recipientMinistryName ? [{ label: "Recipient ministry", value: event.recipientMinistryName }] : [])]} />
          {event.note && <R.Prose variant="body2">{event.note}</R.Prose>}
        </R.ListItem>)}</R.List> : <Typography color="text.secondary">No handling events recorded.</Typography>}
      </RecordCard>
    </R.Main><R.Aside data-record-sidebar>
      <RecordCard title="Current handling" icon={<AssignmentIndOutlined />}><RecordFacts items={[{ label: "Stage", value: current?.name ?? (record.status === "COMPLETED" ? "Route completed" : "No active stage") }, { label: "Handler", value: current?.assignedTo?.name ?? "Not assigned" }, { label: "Current office", value: current?.departmentName ?? "Not assigned" }, { label: "Responsible office", value: record.responsibleDepartmentName ?? "Not assigned" }]} /></RecordCard>
      <RecordCard title="Filing & storage" icon={<Inventory2Outlined />}><RecordFacts items={[{ label: "Storage location", value: record.storageLocation?.name ?? "Not recorded" }, { label: "Storage code", value: record.storageLocation?.code ?? "Not recorded" }, { label: "Chronological code", value: record.chronologicalCode ?? "Not recorded" }, { label: "Archive sequence", value: record.archiveSequence ?? "Not recorded" }]} /></RecordCard>
      <RecordCard title="Notes"><R.Prose variant="body2" color="text.secondary">{record.notes || "No additional notes recorded."}</R.Prose></RecordCard>
      <RecordCard title="Record information" icon={<InfoOutlined />}><RecordFacts items={[{ label: "Created", value: formatAdminDate(record.createdAt) }, { label: "Last updated", value: formatAdminDate(record.updatedAt) }, { label: "Completed", value: record.completedAt ? formatAdminDate(record.completedAt) : "Not completed" }, { label: "Archived", value: record.archivedAt ? formatAdminDate(record.archivedAt) : "Not archived" }, ]} /></RecordCard>
      {record.permissions.canManage && !record.archivedAt && <RecordCard title="Record administration"><Typography variant="body2" color="text.secondary">Archiving removes this record from the active register while preserving its handling history. A separate confirmation is required.</Typography><Button component={NextLink} href={`/admin/documents/delete/${encodeURIComponent(record.id)}`} color="primary" startIcon={<ArchiveOutlined />}>Archive record</Button></RecordCard>}
    </R.Aside></R.Layout>
  </>;
}
