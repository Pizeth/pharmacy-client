"use client";
import { Step, StepLabel, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import PauseCircleOutline from "@mui/icons-material/PauseCircleOutline";
import PendingOutlined from "@mui/icons-material/PendingOutlined";
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import { activeStep, type TrackedDocument } from "./contracts";
import * as S from "./styles";

const labels = {
  ACTIVE: "In progress",
  ON_HOLD: "On hold",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};
export function DocumentStatus({
  status,
}: {
  readonly status: TrackedDocument["status"];
}) {
  const Icon =
    status === "COMPLETED"
      ? CheckCircleOutline
      : status === "ON_HOLD"
        ? PauseCircleOutline
        : status === "CANCELLED"
          ? CancelOutlined
          : PendingOutlined;
  return (
    <S.Status
      size="small"
      data-status={status}
      icon={<Icon color="inherit" />}
      label={labels[status]}
    />
  );
}
export function formatTrackingDate(value: string | null | undefined) {
  return value
    ? new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Phnom_Penh",
      }).format(new Date(value))
    : "—";
}
export function processingDays(record: TrackedDocument, now = Date.now()) {
  return Math.max(
    0,
    Math.floor(
      ((record.completedAt ? new Date(record.completedAt).getTime() : now) -
        new Date(record.receivedAt).getTime()) /
        86_400_000,
    ),
  );
}
export function DocumentProgress({
  record,
  compact = false,
}: {
  readonly record: TrackedDocument;
  readonly compact?: boolean;
}) {
  const theme = useTheme();
  const narrow = useMediaQuery(theme.breakpoints.down("md"));
  const current = activeStep(record);
  const index = current
    ? record.steps.findIndex((step) => step.id === current.id)
    : record.steps.length;
  return (
    <section aria-label="Document route progress">
      <S.Actions>
        <DocumentStatus status={record.status} />
        <Typography variant="body2">
          {current
            ? `Currently: ${current.name}`
            : "All route stages completed"}
        </Typography>
      </S.Actions>
      <S.Progress
        activeStep={index}
        orientation={compact || narrow ? "vertical" : "horizontal"}
        alternativeLabel={!compact && !narrow}
        data-compact={compact ? "true" : undefined}
      >
        {record.steps.map((step) => (
          <Step key={step.id} completed={step.status === "COMPLETED"}>
            <StepLabel
              aria-current={step.status === "ACTIVE" ? "step" : undefined}
              error={step.status === "ACTIVE" && record.status === "CANCELLED"}
            >
              {step.name}
              <Typography
                component="span"
                display="block"
                variant="caption"
                color="text.secondary"
                lang="km"
              >
                {step.nameKh}
              </Typography>
              {step.assignedTo && (
                <Typography
                  component="span"
                  display="block"
                  variant="caption"
                  color="text.secondary"
                >
                  {step.assignedTo.name}
                </Typography>
              )}
            </StepLabel>
          </Step>
        ))}
      </S.Progress>
    </section>
  );
}
