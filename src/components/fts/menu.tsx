"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  FormControl,
} from "@mui/material";
import { X } from "lucide-react";
import IconInput from "../CustomInputs/IconInput";
import { useRequired } from "@/utils/validator";
import { FormProvider, useForm } from "react-hook-form";
import { SelectInput } from "react-admin";
import ArticleIcon from "@mui/icons-material/Article";
import {
  AccessTimeFilledOutlined,
  CalendarMonthOutlined,
  FormatListNumberedOutlined,
} from "@mui/icons-material";

// Common styles for the form inputs to match the screenshot (white bg, compact)
// const inputStyles = {
//   // bgcolor: "white",
//   borderRadius: 1,
//   "& .MuiOutlinedInput-root": {
//     height: "40px",
//     "& input": {
//       padding: "8px 14px",
//     },
//   },
// };

// const labelStyles = {
//   color: "white",
//   fontWeight: 500,
//   fontSize: "0.9rem",
//   mb: 0.5,
//   display: "block",
//   textAlign: "right", // Align labels to right as usually seen in this layout, or left? Image seems center/right aligned for labels relative to input?
//   // Actually in the image, labels are white text above or beside?
//   // Looking closely: The labels are White text ABOVE the input or TO THE LEFT.
//   // In the bottom section: "ឈ្មោះឯកសារ" is to the left of the white input box.
//   // It looks like a Table-like structure: Label (Dark Blue BG) | Input (White BG).
//   // Let's approximate this using a Grid with a dark blue container.
// };

// Custom component for a form row item to match the specific "Label | Input" look
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <Grid container spacing={1} alignItems="center">
        {/* <Grid size={{ xs: 4, md: 4 }} sx={{ textAlign: "right" }}>
          <Typography>{label}</Typography>
        </Grid> */}
        {/* <Grid size={{ xs: 8, md: 8 }}>{children}</Grid> */}
        {children}
      </Grid>
    </Box>
  </Grid>
);

export default function DocumentFormDialog() {
  const methods = useForm();
  const [open, setOpen] = useState(false);

  // Mock data for dropdowns
  const statuses = [
    "កំពុងដំណើរការ",

    "រង់ចាំហត្ថលេខា",
    "ត្រួតពិនិត្យ",
    "បានបដិសេធ",
    "បានបញ្ចប់",
  ];
  const types = [
    "ឯកសាមុខការ",
    "រដ្ឋបាល",
    "ហិរញ្ញវត្ថុ",
    "បុគ្គលិក",
    "បច្ចេកទេស",
  ];
  const categories = [
    "ទំនេរគ្មានបៀវត្ស",
    "ដំឡើងថ្នាក់",
    "តែងតាំង",
    "ផ្ទេរភារកិច្ច",
    "ចូលនិវត្តន៍",
  ];
  const offices = [
    "ការិយាល័យបុគ្គលិក",
    "ការិយាល័យក្របខណ្ឌនិងបៀវត្ស",
    "ការិយាល័យអភិវឌ្ឍធនធានមនុស្ស",
    "ការិយាល័យកិច្ចការទូទៅ",
  ];
  const recieptant = [
    "ម៉ាលី",
    "វិរៈ",
    "ធារ៉ូត",
    "សុខា",
    "ចាន់ណា",
    "វណ្ណៈ",
    "ពិសិដ្ឋ",
    "ដារ៉ា",
    "សម្បត្តិ",
    "បូផា",
  ];
  const permissionType = [
    "ច្បាប់ឈប់ប្រចាំឆ្នាំ",
    "ច្បាប់ឈប់រយៈពេលខ្លី",
    "ច្បាប់ឈប់សម្រាកលំហែមាតុភាព",
    "ច្បាប់ឈប់សម្រាកព្យាបាលជម្ងឺ",
    "ឈប់សម្រាកដោយមានកិច្ចការផ្ទាល់ខ្លួន",
  ];

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const required = useRequired();

  return (
    <Box sx={{ p: 4 }}>
      <Button variant="contained" onClick={handleClickOpen}>
        Open Document Form
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 5, overflow: "hidden" },
        }}
      >
        <DialogTitle
          color="error"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: (theme) => `1px solid ${theme.palette.error.main}`,
          }}
        >
          បញ្ចូលព័ត៌មានឯកសារ
          <IconButton onClick={handleClose}>
            <X size={24} />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {/* SECTION 1: FORM DETAILS */}
          <Box p={2}>
            <FormProvider {...methods}>
              <form>
                <Grid container spacing={2}>
                  {/* Row 1 */}
                  <FormItem colSpan={3}>
                    <IconInput
                      iconStart={<ArticleIcon />}
                      source="title"
                      className="icon-input"
                      fullWidth
                      label="ឈ្មោះឯកសារ"
                      validate={required()}
                      resettable
                    />
                  </FormItem>
                  <FormItem colSpan={3}>
                    <IconInput
                      iconStart={<FormatListNumberedOutlined />}
                      source="title"
                      className="icon-input"
                      fullWidth
                      label="លេខលិខិត"
                      validate={required()}
                      resettable
                    />
                  </FormItem>
                  <FormItem colSpan={3}>
                    <IconInput
                      // type="date"
                      iconStart={<CalendarMonthOutlined />}
                      source="title"
                      className="icon-input"
                      fullWidth
                      label="កាលបរិច្ឆេទលិខិតចូល"
                      validate={required()}
                      resettable
                    />
                  </FormItem>
                  <FormItem colSpan={3}>
                    <IconInput
                      // type="time"
                      iconStart={<AccessTimeFilledOutlined />}
                      source="title"
                      className="icon-input"
                      fullWidth
                      label="ម៉ោងចូល"
                      validate={required()}
                      resettable
                    />
                  </FormItem>

                  {/* Row 2 */}
                  <FormItem colSpan={3}>
                    <FormControl fullWidth size="small">
                      <SelectInput
                        source="status"
                        label="កម្រិតនៃស្ថានភាព"
                        choices={statuses}
                        emptyText="សូមជ្រើសរើស"
                        required
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem colSpan={3}>
                    <FormControl fullWidth size="small">
                      <SelectInput
                        source="type"
                        label="ប្រភេទ"
                        choices={types}
                        emptyText="សូមជ្រើសរើស"
                        required
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem colSpan={3}>
                    <FormControl fullWidth size="small">
                      <SelectInput
                        source="office"
                        label="ការិយាល័យទទួលបន្ទុក"
                        choices={offices}
                        emptyText="សូមជ្រើសរើស"
                        required
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem colSpan={3}>
                    <FormControl fullWidth size="small">
                      <SelectInput
                        source="category"
                        label="ឯកសារ"
                        choices={categories}
                        emptyText="សូមជ្រើសរើស"
                        required
                      />
                    </FormControl>
                  </FormItem>

                  {/* Row 3 */}
                  <FormItem colSpan={3}>
                    <FormControl fullWidth size="small">
                      <SelectInput
                        source="permissionType"
                        label="ប្រភេទច្បាប់ឈប់សម្រាក"
                        choices={permissionType}
                        emptyText="សូមជ្រើសរើស"
                        required
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem colSpan={3}>
                    <FormControl fullWidth size="small">
                      <SelectInput
                        source="recieptant"
                        label="អ្នកទទួលឯកសារ"
                        choices={recieptant}
                        emptyText="សូមជ្រើសរើស"
                        required
                      />
                    </FormControl>
                  </FormItem>

                  {/* Action Buttons Row */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: "flex", gap: 0, mt: 0 }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                          flex: 1,
                        }}
                      >
                        <Typography variant="body2">
                          <strong>បញ្ជូនឯកសារ</strong>
                        </Typography>
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        sx={{
                          flex: 1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Typography variant="body2">
                          <strong>Upload រូបភាពឯកសារដើម</strong>
                        </Typography>
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
