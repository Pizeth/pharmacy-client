"use client";
import { FormActions } from "@/components/forms/FormActions";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import BadgeOutlined from "@mui/icons-material/BadgeOutlined";
import ColorLensOutlined from "@mui/icons-material/ColorLensOutlined";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import ImageOutlined from "@mui/icons-material/ImageOutlined";
import { TextField, SelectField } from "@/components/inputs";
import { RoleBadge } from "../users/UserIdentity";
import {
  rolesApi,
  roleInputSchema,
  RoleRequestError,
  type ApplicationRole,
  type RoleMode,
  type RoleMetadata,
  type RoleInput,
} from "./api";
import * as S from "./styles";
import { rgbToHex, useTheme } from "@mui/material/styles";
import { BadgeColorPicker } from "./BadgeColorPicker";
export function RoleForm({
  mode,
  record,
  metadata,
  onCancel,
  onSuccess,
  onPendingChange,
}: {
  readonly mode: RoleMode;
  readonly record?: ApplicationRole;
  readonly metadata: RoleMetadata;
  readonly onCancel: () => void;
  readonly onSuccess: (record: ApplicationRole) => void;
  readonly onPendingChange?: (pending: boolean) => void;
}) {
  const [initial] = useState(record);
  const theme = useTheme();
  const [defaultColor] = useState(() => rgbToHex(
    /^(super|sys|system)[_-]?admin$/i.test(record?.name ?? "")
      ? theme.palette.primary.main : theme.palette.text.secondary,
  ).slice(0, 7));
  const client = useQueryClient();
  const inFlight = useRef(false);
  const form = useForm({
    defaultValues: {
      name: record?.name ?? "",
      description: record?.description ?? "",
      icon: record?.icon ?? "",
      color: record ? record.color ?? defaultColor : "",
      isEnabled: record?.isEnabled ?? true,
      permissionIds:
        record?.permissions.map((permission) => permission.id) ?? [],
    },
  });
  const draft = useWatch({ control: form.control });
  const [validation, setValidation] = useState("");
  const mutation = useMutation({
    mutationFn: (data: RoleInput) =>
      mode === "delete"
        ? rolesApi.remove(initial!)
        : rolesApi.save(data, mode === "edit" ? initial : undefined),
    onSuccess: async (result) => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ["admin-roles"] }),
        client.invalidateQueries({ queryKey: ["admin-users"] }),
      ]);
      onSuccess(result);
    },
  });
  useEffect(() => {
    onPendingChange?.(mutation.isPending);
  }, [mutation.isPending, onPendingChange]);
  const conflict =
    mutation.error instanceof RoleRequestError &&
    mutation.error.code === "ROLE_VERSION_CONFLICT";
  const locked = mutation.isPending;
  const cannotDelete =
    mode === "delete" &&
    (!initial || initial.isProtected || initial.userCount > 0);
  const groups = Map.groupBy(
    metadata.permissions,
    (permission) => permission.subject,
  );
  return (
    <FormProvider {...form}>
      <S.Form
        noValidate
        aria-busy={locked}
        onSubmit={async (event) => {
          event.preventDefault();
          if (inFlight.current || conflict || cannotDelete) return;
          const values = form.getValues();
          const parsed = roleInputSchema.safeParse({
            ...values,
            description: values.description.trim() || null,
            icon: values.icon || null,
            color: initial && initial.color == null && !form.getFieldState("color").isDirty
              ? null : values.color.trim() || null,
          });
          if (mode !== "delete" && !parsed.success) {
            setValidation(parsed.error.issues[0].message);
            return;
          }
          inFlight.current = true;
          setValidation("");
          try {
            await mutation.mutateAsync(
              parsed.success
                ? parsed.data
                : {
                    name: "",
                    description: null,
                    icon: null,
                    color: null,
                    isEnabled: false,
                    permissionIds: [],
                  },
            );
          } catch {
            /* Keep draft and present the mutation error. */
          } finally {
            inFlight.current = false;
          }
        }}
      >
        {mode === "delete" ? (
          <>
            <Typography>
              Delete role <strong>{initial?.name}</strong>?
            </Typography>
            <Alert severity={cannotDelete ? "warning" : "info"}>
              {initial?.isProtected
                ? "Bootstrap roles cannot be deleted."
                : initial?.userCount
                  ? `This role is assigned to ${initial.userCount} users. Reassign them before deleting it.`
                  : "The role and its grant links will be removed. Its audit history is retained."}
            </Alert>
          </>
        ) : (
          <>
            {initial?.isProtected && (
              <Alert severity="info">
                This bootstrap role retains its name, enabled state and
                permissions. You can edit its description, icon and color.
              </Alert>
            )}
            <TextField
              name="name"
              label="Role name"
              iconStart={<BadgeOutlined />}
              required
              fullWidth
              disabled={locked || initial?.isProtected}
              helperText="Stored as uppercase letters, numbers and underscores. This is the application role name."
            />
            <TextField
              name="description"
              iconStart={<DescriptionOutlined />}
              iconStartAlignment="top"
              label="Description"
              fullWidth
              multiline
              minRows={2}
              disabled={locked}
            />
            <S.Fields>
              <SelectField
                name="icon"
                iconStart={<ImageOutlined />}
                label="Badge icon"
                options={metadata.icons}
                disabled={locked}
              />
              <TextField
                name="color"
                label="Badge color"
                iconStart={<ColorLensOutlined />}
                iconEnd={
                  <BadgeColorPicker
                    value={draft.color ?? ""}
                    disabled={locked}
                    onChange={(color) => form.setValue("color", color, { shouldDirty: true, shouldTouch: true, shouldValidate: true })}
                  />
                }
                fullWidth
                disabled={locked}
                helperText={initial && initial.color == null ? "No custom color is stored. The current theme default is shown; changing it saves a custom HEX color." : "Enter a six-digit HEX color or choose one with the color picker. Leave empty for the default."}
              />
            </S.Fields>
            <S.Actions>
              <Typography variant="caption">Preview</Typography>
              <RoleBadge
                role={{
                  id: initial?.id ?? 0,
                  name: draft.name || "ROLE",
                  icon: draft.icon || null,
                  color:
                    !(initial && initial.color == null && !form.getFieldState("color").isDirty) && draft.color && /^#[0-9a-fA-F]{6}$/.test(draft.color)
                      ? draft.color
                      : null,
                }}
              />
            </S.Actions>
            <FormControlLabel
              label="Enabled"
              control={
                <Checkbox
                  checked={draft.isEnabled ?? true}
                  disabled={locked || initial?.isProtected}
                  onChange={(_, checked) => form.setValue("isEnabled", checked)}
                />
              }
            />
            {!!initial?.userCount && (
              <Alert severity="warning">
                Changes affect {initial.userCount} assigned users on their next
                authorization check.
              </Alert>
            )}
            <Typography component="h3" variant="h6">
              Application permissions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              These grants are evaluated by the application policy. Resource and
              attribute checks still apply. Role administration remains
              super-admin only.
            </Typography>
            {metadata.permissions.length === 0 && (
              <Alert severity="info">
                No permission definitions are available yet. A role without
                grants receives no application permissions.
              </Alert>
            )}
            <S.Permissions>
              {[...groups].map(([subject, permissions]) => (
                <S.PermissionGroup key={subject}>
                  <legend>{subject}</legend>
                  {permissions.map((permission) => {
                    const selected =
                      draft.permissionIds?.includes(permission.id) ?? false;
                    return (
                      <FormControlLabel
                        key={permission.id}
                        label={`${permission.action}${permission.supported ? "" : " (not currently evaluated)"}`}
                        control={
                          <Checkbox
                            checked={selected}
                            disabled={
                              locked ||
                              initial?.isProtected ||
                              (!permission.supported && !selected)
                            }
                            onChange={(_, checked) => {
                              const current = form.getValues("permissionIds");
                              form.setValue(
                                "permissionIds",
                                checked
                                  ? [...current, permission.id]
                                  : current.filter(
                                      (id) => id !== permission.id,
                                    ),
                              );
                            }}
                          />
                        }
                      />
                    );
                  })}
                </S.PermissionGroup>
              ))}
            </S.Permissions>
          </>
        )}
        {(validation || mutation.error) && (
          <Alert severity="error">
            {validation || mutation.error?.message}
          </Alert>
        )}
        <FormActions>
          <Button onClick={onCancel} disabled={locked} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color={mode === "delete" ? "error" : "success"}
            loading={locked}
            disabled={locked || conflict || cannotDelete}
          >
            {mode === "create"
              ? "Create role"
              : mode === "edit"
                ? "Save changes"
                : "Delete role"}
          </Button>
        </FormActions>
      </S.Form>
    </FormProvider>
  );
}
