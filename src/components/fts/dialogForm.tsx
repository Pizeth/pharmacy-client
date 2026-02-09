// --- PROPS INTERFACE ---

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { km } from "date-fns/locale/km";
import IconInput from "../CustomInputs/IconInput";
import SaveIcon from "@mui/icons-material/Save";
import ArticleIcon from "@mui/icons-material/Article";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useRequired } from "@/utils/validator";
import { FormatListNumberedOutlined } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { FormDataConsumer, SelectInput } from "react-admin";
import { useEffect } from "react";

// Mock data for dropdowns
const statuses = [
  "កំពុងដំណើរការ",

  "រង់ចាំហត្ថលេខា",
  "ត្រួតពិនិត្យ",
  "បានបដិសេធ",
  "បានបញ្ចប់",
];
const types = ["ឯកសាមុខការ", "រដ្ឋបាល", "ហិរញ្ញវត្ថុ", "បុគ្គលិក", "បច្ចេកទេស"];
const categories = [
  "ទំនេរគ្មានបៀវត្ស",
  "ដំឡើងថ្នាក់",
  "តែងតាំង",
  "ផ្ទេរភារកិច្ច",
  "ចូលនិវត្តន៍",
  "សំណើសុំច្បាប់ឈប់សម្រាក",
];
const offices = [
  "ការិយាល័យបុគ្គលិក",
  "ការិយាល័យក្របខណ្ឌនិងបៀវត្ស",
  "ការិយាល័យអភិវឌ្ឍធនធានមនុស្ស",
  "ការិយាល័យកិច្ចការទូទៅ",
];

const permissionType = [
  "ច្បាប់ឈប់ប្រចាំឆ្នាំ",
  "ច្បាប់ឈប់រយៈពេលខ្លី",
  "ច្បាប់ឈប់សម្រាកលំហែមាតុភាព",
  "ច្បាប់ឈប់សម្រាកព្យាបាលជម្ងឺ",
  "ឈប់សម្រាកដោយមានកិច្ចការផ្ទាល់ខ្លួន",
];

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

// --- HELPER COMPONENT ---
const FormItem = ({
  // label,
  children,
  colSpan = 3,
}: {
  // label: string;
  children: React.ReactNode;
  colSpan?: number;
}) => (
  <Grid size={{ xs: 12, md: colSpan }}>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        alignContent: "center",
        // alignItems: "center",
      }}
    >
      <Grid container spacing={0} alignItems="center">
        {/* <Grid size={{ xs: 4, md: 4 }} sx={{ textAlign: "right" }}>
          <Typography>{label}</Typography>
        </Grid> */}
        {/* <Grid size={{ xs: 8, md: 8 }}>{children}</Grid> */}
        {children}
      </Grid>
    </Box>
  </Grid>
);

// We add this interface to define what data the parent (Table) passes to this component
export interface DocumentFormDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: any; // Optional: Pass data here if you want to pre-fill the form for editing
}

export default function DocumentFormDialog({
  open,
  onClose,
  initialData,
}: DocumentFormDialogProps) {
  const methods = useForm();
  const required = useRequired();
  const { setValue } = useFormContext();

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose();
        }
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: 5, overflow: "hidden" } },
      }}
    >
      <FormProvider {...methods}>
        <form>
          <DialogTitle
            color="error"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: (theme) => `1px solid ${theme.palette.error.main}`,
            }}
          >
            {initialData
              ? `ធ្វើបច្ចុប្បន្នភាពព័ត៌មានឯកសារ: ${initialData}`
              : "បញ្ចូលព័ត៌មានឯកសារ"}
            <IconButton onClick={onClose} color="primary">
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          {/* Wrap content in LocalizationProvider for Date/Time pickers */}
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={km}>
            <DialogContent>
              {/* SECTION 1: FORM DETAILS */}
              <Box p={2}>
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  {/* Row 1 */}
                  <FormItem colSpan={12}>
                    <IconInput
                      iconStart={<ArticleIcon />}
                      source="title"
                      className="icon-input"
                      fullWidth
                      label="ឈ្មោះឯកសារ"
                      validate={required()}
                      resettable
                      helperText="ឈ្មោះឯកសារ ឬកម្មវត្ថុ"
                    />
                  </FormItem>
                  <FormItem colSpan={4}>
                    <IconInput
                      iconStart={<FormatListNumberedOutlined />}
                      source="docNo"
                      className="icon-input"
                      fullWidth
                      label="លេខលិខិត"
                      validate={required()}
                      resettable
                    />
                  </FormItem>
                  <FormItem colSpan={4}>
                    {/* DATE PICKER */}
                    <DatePicker
                      label="កាលបរិច្ឆេទលិខិតចូល"
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          size: "small",
                          helperText: "ថ្ងៃ/ខែ/ឆ្នាំ",
                          fullWidth: true,
                          // sx: inputStyles,
                          InputProps: {
                            sx: {
                              borderRadius: 50, // Apply specific border radius
                            },
                          },
                        },
                        field: {
                          clearable: true,
                          // onClear: () => setCleared(true),
                        },
                      }}
                    />
                  </FormItem>
                  <FormItem colSpan={4}>
                    <TimePicker
                      label="ម៉ោងចូល"
                      format="HH:mm"
                      slotProps={{
                        textField: {
                          size: "small",
                          helperText: "ម៉ោង-នាទី",
                          fullWidth: true,
                          InputProps: {
                            sx: {
                              borderRadius: 50, // Apply specific border radius
                            },
                          },
                        },
                        field: {
                          clearable: true,
                          // onClear: () => setCleared(true),
                        },
                      }}
                    />
                  </FormItem>

                  {/* Row 2 */}
                  <FormItem colSpan={4}>
                    {/* <FormControl fullWidth size="small"> */}
                    <SelectInput
                      source="status"
                      label="កម្រិតនៃស្ថានភាព"
                      choices={statuses}
                      emptyText="សូមជ្រើសរើស"
                      required
                    />
                    {/* </FormControl> */}
                  </FormItem>
                  <FormItem colSpan={4}>
                    {/* <FormControl fullWidth size="small"> */}
                    <SelectInput
                      source="type"
                      label="ប្រភេទ"
                      choices={types}
                      emptyText="សូមជ្រើសរើស"
                      required
                    />
                    {/* </FormControl> */}
                  </FormItem>
                  <FormItem colSpan={4}>
                    {/* <FormControl fullWidth size="small"> */}
                    <SelectInput
                      source="office"
                      label="ការិយាល័យទទួលបន្ទុក"
                      choices={offices}
                      emptyText="សូមជ្រើសរើស"
                      required
                    />
                    {/* </FormControl> */}
                  </FormItem>

                  {/* <FormItem colSpan={4}>
                      <FormControl fullWidth>
                        <Controller
                          name="category"
                          control={control}
                          render={({ field }) => (
                            <SelectInput
                              {...field}
                              source="category"
                              label="ឯកសារ"
                              choices={categories}
                              emptyText="សូមជ្រើសរើស"
                              required
                            />
                          )}
                        />
                      </FormControl>
                    </FormItem> */}

                  <FormItem colSpan={4}>
                    <SelectInput
                      source="category"
                      label="ឯកសារ"
                      choices={categories}
                      emptyText="សូមជ្រើសរើស"
                      required
                    />
                  </FormItem>

                  {/* <FormItem colSpan={4}>
                      <FormControl disabled={!isEnabled}>
                        <Controller
                          name="permissionType"
                          control={control}
                          render={({ field }) => (
                            <SelectInput
                              {...field}
                              disabled={!isEnabled}
                              source="office"
                              label="ប្រភេទច្បាប់ឈប់សម្រាក"
                              choices={permissionType}
                              emptyText="សូមជ្រើសរើស"
                              required
                            />
                          )}
                        />
                      </FormControl>
                    </FormItem> */}

                  {/* Row 3 */}
                  {/* <FormItem colSpan={4}>
                      <SelectInput
                        source="permissionType"
                        label="ប្រភេទច្បាប់ឈប់សម្រាក"
                        choices={permissionType}
                        emptyText="សូមជ្រើសរើស"
                        required
                      />
                    </FormItem> */}

                  <FormItem colSpan={4}>
                    <FormDataConsumer>
                      {({ formData, ...rest }) => {
                        const isEnabled =
                          formData.category === "សំណើសុំច្បាប់ឈប់សម្រាក";

                        // Reset logic: clear the value if disabled
                        useEffect(() => {
                          if (!isEnabled) {
                            // setValue("permissionType", null);
                            setValue("permissionType", "", {
                              shouldValidate: true,
                            });
                          }
                        }, [isEnabled, setValue]);

                        return (
                          <SelectInput
                            disabled={!isEnabled}
                            source="permissionType"
                            label="ប្រភេទច្បាប់ឈប់សម្រាក"
                            choices={permissionType}
                            emptyText="សូមជ្រើសរើស"
                            // required
                          />
                        );
                      }}
                    </FormDataConsumer>
                  </FormItem>

                  {/* Action Buttons Row */}
                  {/* <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: "flex", gap: 0, mt: 0 }}>
                      <Button
                        variant="contained"
                        color="error"
                        sx={{
                          flex: 1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Typography variant="body2">
                          <strong>បញ្ចូលរូបភាពឯកសារដើម</strong>
                        </Typography>
                      </Button>
                    </Box>
                  </Grid> */}
                  <FormItem colSpan={4}>
                    {/* <Grid container justifyContent="center"> */}
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      color="error"
                      fullWidth
                      tabIndex={-1}
                      size="large"
                      startIcon={<CloudUploadIcon />}
                      sx={{ my: "0.5em" }}
                    >
                      <Typography variant="body2">
                        <strong>បញ្ចូលរូបភាពឯកសារដើម</strong>
                      </Typography>
                      <VisuallyHiddenInput
                        type="file"
                        onChange={(event) => console.log(event.target.files)}
                        multiple
                      />
                    </Button>
                    {/* </Grid> */}
                  </FormItem>
                </Grid>
              </Box>
            </DialogContent>
          </LocalizationProvider>

          <DialogActions
            sx={{
              // display: "flex",
              // justifyContent: "space-between",
              // alignItems: "center",
              borderTop: (theme) => `1px solid ${theme.palette.error.main}`,
              px: 1.5,
              py: 2,
            }}
          >
            {/* <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose} variant="contained">
              Subscribe
            </Button> */}
            <Box width={"100%"}>
              <Grid container spacing={2} justifyContent="right">
                <Grid size={{ xs: 5, md: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    fullWidth
                    size="large"
                    color="success"
                    autoFocus
                    type="submit"
                  >
                    <Typography variant="body2">
                      <strong>រក្សាទុក</strong>
                    </Typography>
                  </Button>
                </Grid>
                <Grid size={{ xs: 5, md: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<CancelIcon />}
                    fullWidth
                    size="large"
                    color="primary"
                    onClick={onClose}
                  >
                    <Typography variant="body2">
                      <strong>បិទ</strong>
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {/* <Button
            variant="contained"
            color="secondary"
            sx={{
              flex: 1,
            }}
          >
            <Typography variant="body2">
              <strong>បញ្ជូនឯកសារ</strong>
            </Typography>
          </Button> */}
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
