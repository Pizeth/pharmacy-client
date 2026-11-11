"use client";
import { useId } from "react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { FormHelperText, Typography } from "@mui/material";
import { AttachFileOutlined, FolderOutlined, LinkOutlined, CloudUploadOutlined } from "@mui/icons-material";
import { SelectField, TextField } from "@/components/inputs";

import * as S from "./styles";

const DEFAULT_NAMES = { source: "source", name: "name", url: "url", kind: "kind", file: "file" };
export function AttachmentFields({ names = DEFAULT_NAMES, file, onFileChange, disabled, useDocumentTitle = false }: {
  readonly names?: typeof DEFAULT_NAMES;
  readonly file: File | null;
  readonly onFileChange: (file: File | null) => void;
  readonly disabled?: boolean;
  readonly useDocumentTitle?: boolean;
}) {
  const { clearErrors, control, getFieldState, getValues, setValue } = useFormContext();
  const fileErrorId = useId();
  const state = useFormState({ control, name: names.file });
  const fileError = getFieldState(names.file, state).error?.message;
  const source = useWatch({ control, name: names.source });
  return <>
    <S.AttachmentSourceRow>
      <SelectField name={names.source} label="Attachment source" required includeEmptyOption={false} iconStart={<AttachFileOutlined />} disabled={disabled}
        options={[{ value: "upload", label: "Upload file" }, { value: "link", label: "File URL" }]} />
      {source === "upload" ? <S.UploadButton component="label" role={undefined} tabIndex={-1} variant="text" startIcon={<CloudUploadOutlined />} disabled={disabled}>Upload file
        <S.FileInput name={names.file} type="file" required aria-label="Attachment file" aria-invalid={!!fileError} aria-describedby={fileError ? fileErrorId : undefined} disabled={disabled} onChange={event => {
          const selected = event.target.files?.[0] ?? null;
          clearErrors(names.file);
          onFileChange(selected);
          const currentName = getValues(names.name);
          if (selected && (!currentName || currentName === file?.name)) setValue(names.name, selected.name, { shouldDirty: true });
        }} />
      </S.UploadButton> : <TextField name={names.url} label="File URL" iconStart={<LinkOutlined />} type="url" required fullWidth disabled={disabled} />}
    </S.AttachmentSourceRow>
    {source === "upload" && fileError && <FormHelperText id={fileErrorId} error>{fileError}</FormHelperText>}
    {source === "upload" && !fileError && <Typography variant="caption">{file?.name ?? "No file selected"} · Maximum 32 MB</Typography>}
    <TextField name={names.name} label="Attachment name" iconStart={<AttachFileOutlined />} required={!useDocumentTitle} fullWidth disabled={disabled}
      placeholder={useDocumentTitle ? "Uses document title if empty" : undefined} />
    <SelectField name={names.kind} label="Attachment type" iconStart={<FolderOutlined />} disabled={disabled}
      options={[{ value: "INCOMING", label: "Incoming document" }, { value: "OUTGOING", label: "Final document" }, { value: "SUPPORTING", label: "Supporting document" }]} />
  </>;
}
