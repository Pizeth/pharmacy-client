"use client";

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { SelectInput } from "react-admin";
import { permissionType } from "./mockData";

/** The dependent field subscribes to the form which actually owns it. */
export function PermissionTypeInput() {
  const { control, setValue } = useFormContext();
  const category = useWatch({ control, name: "category" });
  const enabled = category === "សំណើសុំច្បាប់ឈប់សម្រាក";

  useEffect(() => {
    if (!enabled) setValue("permissionType", "", { shouldValidate: true });
  }, [enabled, setValue]);

  return (
    <SelectInput
      disabled={!enabled}
      source="permissionType"
      label="ប្រភេទច្បាប់ឈប់សម្រាក"
      choices={permissionType}
      emptyText="សូមជ្រើសរើស"
    />
  );
}
