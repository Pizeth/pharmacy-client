"use client";

// import { useId } from "react";

// import {
//   FormControl,
//   FormHelperText,
//   Grid,
//   InputAdornment,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   styled,
//   useTheme,
// } from "@mui/material";

// import {
//   CategoryOutlined,
//   DescriptionOutlined,
//   KeyOutlined,
// } from "@mui/icons-material";

// import { Controller, useFormContext } from "react-hook-form";

// /**
//  * ------------------------------------------------------------------
//  * UI form values
//  * ------------------------------------------------------------------
//  *
//  * These are deliberately presentation values rather than HTTP DTOs.
//  *
//  * categoryId is represented as a string because that is the natural
//  * representation used by an HTML/MUI select.
//  *
//  * The mutation boundary converts:
//  *
//  *   categoryId string
//  *       ↓
//  *   number
//  *
//  * before validating with the canonical resource schema.
//  *
//  * Likewise Description remains an editable string in the UI and the
//  * mutation boundary converts blank/whitespace-only content to null.
//  */
// export interface TranslationKeyFormValues {
//   key: string;
//   description: string;
//   categoryId: string;
// }

// export const EMPTY_TRANSLATION_KEY_FORM_VALUES: TranslationKeyFormValues = {
//   key: "",
//   description: "",
//   categoryId: "",
// };

// /**
//  * Keep the fields independent from DataTable's filter-option type.
//  *
//  * The resource currently happens to reuse the category collection
//  * loaded for table filtering, but a form field should not depend on:
//  *
//  *   MuiDataTableFilterOption
//  *
//  * as an architectural requirement.
//  */
// export interface TranslationKeyFormOption {
//   readonly label: string;
//   readonly value: string | number | boolean;
// }

// export interface TranslationKeyFormFieldsProps {
//   readonly categoryOptions: readonly TranslationKeyFormOption[];
//   readonly disabled?: boolean;
//   readonly categoryDisabled?: boolean;
//   readonly autoFocusKey?: boolean;
// }

// const FieldRoot = styled(TextField)(({ theme }) => ({
//   "& .MuiOutlinedInput-root": {
//     borderRadius: theme.spacing(1.5),
//   },
// }));

// const CategoryControlRoot = styled(FormControl)(({ theme }) => ({
//   "& .MuiOutlinedInput-root": {
//     borderRadius: theme.spacing(1.5),
//   },
// }));

// /**
//  * Shared metadata fields used by create and, beginning in 7.2, edit.
//  *
//  * This component:
//  *
//  * - performs no request
//  * - owns no mutation
//  * - owns no category fetching
//  * - knows nothing about create vs edit
//  *
//  * It is only a resource-specific field renderer backed by RHF.
//  */
// export function TranslationKeyFormFields(props: TranslationKeyFormFieldsProps) {
//   const {
//     categoryOptions,
//     disabled = false,
//     categoryDisabled = false,
//     autoFocusKey = false,
//   } = props;

//   const { direction } = useTheme();

//   const categoryLabelId = useId();

//   const {
//     control,
//     clearErrors,
//     formState: { errors },
//   } = useFormContext<TranslationKeyFormValues>();

//   return (
//     <Grid container spacing={2}>
//       <Grid
//         size={{
//           xs: 12,
//           sm: 7,
//         }}
//       >
//         <Controller
//           name="key"
//           control={control}
//           render={({ field }) => (
//             <FieldRoot
//               autoFocus={autoFocusKey}
//               fullWidth
//               required
//               label="Key"
//               name={field.name}
//               value={field.value}
//               inputRef={field.ref}
//               onBlur={field.onBlur}
//               onChange={(event) => {
//                 field.onChange(event.target.value);
//                 clearErrors("key");
//               }}
//               disabled={disabled}
//               error={Boolean(errors.key)}
//               helperText={
//                 errors.key?.message ??
//                 "Stable lookup key, for example auth_login."
//               }
//               slotProps={{
//                 input: {
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <KeyOutlined
//                         fontSize="small"
//                         color={errors.key ? "error" : "action"}
//                       />
//                     </InputAdornment>
//                   ),
//                 },
//               }}
//             />
//           )}
//         />
//       </Grid>

//       <Grid
//         size={{
//           xs: 12,
//           sm: 5,
//         }}
//       >
//         <Controller
//           name="categoryId"
//           control={control}
//           render={({ field }) => (
//             <CategoryControlRoot
//               fullWidth
//               required
//               disabled={disabled || categoryDisabled}
//               error={Boolean(errors.categoryId)}
//             >
//               <InputLabel id={categoryLabelId}>Category</InputLabel>

//               <Select<string>
//                 name={field.name}
//                 inputRef={field.ref}
//                 labelId={categoryLabelId}
//                 label="Category"
//                 value={field.value}
//                 onBlur={field.onBlur}
//                 onChange={(event) => {
//                   field.onChange(event.target.value);

//                   clearErrors("categoryId");
//                 }}
//                 startAdornment={
//                   <InputAdornment position="start">
//                     <CategoryOutlined
//                       fontSize="small"
//                       color={errors.categoryId ? "error" : "action"}
//                     />
//                   </InputAdornment>
//                 }
//                 MenuProps={{
//                   /**
//                    * MUI Select uses a portal.
//                    *
//                    * Preserve the RTL contract established in 6F.7.
//                    */
//                   dir: direction,
//                 }}
//               >
//                 <MenuItem value="">Choose a category</MenuItem>

//                 {categoryOptions.map((option) => {
//                   const value = String(option.value);

//                   return (
//                     <MenuItem key={value} value={value}>
//                       {option.label}
//                     </MenuItem>
//                   );
//                 })}
//               </Select>

//               <FormHelperText>
//                 {errors.categoryId?.message ?? "Owning translation category."}
//               </FormHelperText>
//             </CategoryControlRoot>
//           )}
//         />
//       </Grid>

//       <Grid size={{ xs: 12 }}>
//         <Controller
//           name="description"
//           control={control}
//           render={({ field }) => (
//             <FieldRoot
//               fullWidth
//               multiline
//               minRows={3}
//               label="Description"
//               name={field.name}
//               value={field.value}
//               inputRef={field.ref}
//               onBlur={field.onBlur}
//               onChange={(event) => {
//                 field.onChange(event.target.value);
//                 clearErrors("description");
//               }}
//               disabled={disabled}
//               error={Boolean(errors.description)}
//               helperText={
//                 errors.description?.message ??
//                 "Optional description shown to administrators."
//               }
//               slotProps={{
//                 input: {
//                   startAdornment: (
//                     <InputAdornment
//                       position="start"
//                       sx={{
//                         alignSelf: "flex-start",
//                         mt: 1.25,
//                       }}
//                     >
//                       <DescriptionOutlined
//                         fontSize="small"
//                         color={errors.description ? "error" : "action"}
//                       />
//                     </InputAdornment>
//                   ),
//                 },
//               }}
//             />
//           )}
//         />
//       </Grid>
//     </Grid>
//   );
// }

// ("use client");

import { useMemo } from "react";
import { Grid } from "@mui/material";
import {
  CategoryOutlined,
  DescriptionOutlined,
  KeyOutlined,
} from "@mui/icons-material";
import { SelectField, TextField } from "@/components/inputs";

/**
 * ------------------------------------------------------------------
 * UI form values
 * ------------------------------------------------------------------
 *
 * These are deliberately presentation values rather than HTTP DTOs.
 *
 * categoryId is represented as a string because that is the natural
 * representation used by an HTML/MUI select.
 *
 * The mutation boundary converts:
 *
 *   categoryId string
 *       ↓
 *   number
 *
 * before validating with the canonical resource schema.
 *
 * Likewise Description remains an editable string in the UI and the
 * mutation boundary converts blank/whitespace-only content to null.
 */
export interface TranslationKeyFormValues {
  key: string;
  description: string;
  categoryId: string;
}

export const EMPTY_TRANSLATION_KEY_FORM_VALUES: TranslationKeyFormValues = {
  key: "",
  description: "",
  categoryId: "",
};

/**
 * Keep the fields independent from DataTable's filter-option type.
 *
 * The resource currently happens to reuse the category collection
 * loaded for table filtering, but a form field should not depend on:
 *
 *   MuiDataTableFilterOption
 *
 * as an architectural requirement.
 */
export interface TranslationKeyFormOption {
  readonly label: string;
  readonly value: string | number | boolean;
}

export interface TranslationKeyFormFieldsProps {
  readonly categoryOptions: readonly TranslationKeyFormOption[];
  readonly disabled?: boolean;
  readonly categoryDisabled?: boolean;
  readonly autoFocusKey?: boolean;
}

/**
 * Shared metadata fields used by create and edit.
 *
 * This component:
 *
 * - performs no request
 * - owns no mutation
 * - owns no category fetching
 * - knows nothing about create vs edit
 *
 * It is only a resource-specific field renderer backed by RHF.
 */
export function TranslationKeyFormFields(props: TranslationKeyFormFieldsProps) {
  const {
    categoryOptions,
    disabled = false,
    categoryDisabled = false,
    autoFocusKey = false,
  } = props;

  const selectOptions = useMemo(
    () =>
      categoryOptions.map((option) => ({
        label: option.label,
        value: String(option.value),
      })),
    [categoryOptions],
  );

  return (
    <Grid container spacing={2}>
      <Grid
        size={{
          xs: 12,
          sm: 7,
        }}
      >
        <TextField
          name="key"
          label="Key"
          autoFocus={autoFocusKey}
          required
          fullWidth
          disabled={disabled}
          iconStart={<KeyOutlined />}
          helperText="Stable lookup key, for example auth_login."
        />
      </Grid>

      <Grid
        size={{
          xs: 12,
          sm: 5,
        }}
      >
        <SelectField
          name="categoryId"
          label="Category"
          required
          disabled={disabled || categoryDisabled}
          iconStart={<CategoryOutlined />}
          options={selectOptions}
          placeholder="Choose a category"
          helperText="Owning translation category."
        />
      </Grid>

      <Grid
        size={{
          xs: 12,
        }}
      >
        <TextField
          name="description"
          label="Description"
          multiline
          minRows={3}
          fullWidth
          disabled={disabled}
          iconStart={<DescriptionOutlined />}
          helperText="Optional description shown to administrators."
        />
      </Grid>
    </Grid>
  );
}
