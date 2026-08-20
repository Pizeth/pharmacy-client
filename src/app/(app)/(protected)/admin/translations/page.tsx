// // src/app/(protected)/admin/translations/page.tsx
// "use client";
// import { useTable, useDelete, BaseRecord } from "@refinedev/core";
// // import { DataGrid } from "@mui/x-data-grid";
// import {
//   Box,
//   Button,
//   Checkbox,
//   IconButton,
//   ListItemIcon,
//   ListItemText,
//   Menu,
//   MenuItem,
//   Paper,
//   styled,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Tooltip,
//   Typography,
// } from "@mui/material";
// import {
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   MoreVert as MoreVertIcon,
//   Print,
//   Article,
//   AssignmentTurnedIn,
//   Add,
//   PictureAsPdf,
//   ImageNotSupported,
//   KeyboardArrowDown,
//   KeyboardArrowRight,
// } from "@mui/icons-material";
// import Link from "next/link";
// import {
//   ColumnDef,
//   ExpandedState,
//   Row,
//   RowSelectionState,
// } from "@tanstack/react-table";
// import { useMemo, useState } from "react";
// import {
//   FullScreenToggleButton,
//   GlobalFilterTextField,
//   ShowHideColumnsButton,
//   TablePaginationBar,
// } from "@/components/DataTable/DataTableToolbars";
// import DataTable, { useDataTable } from "@/components/DataTable/DataTable";
// import DocumentFormDialog from "@/components/fts/dialogForm";

// const PREFIX = "RazethTranslationsListPage";

// const Root = styled(Box)(({ theme }) => ({
//   width: "100%",
//   border: `1px solid ${theme.alpha(theme.vars.palette.text.primary, 0.125)}`,
//   borderRadius: "25px",
// }));

// const ToolBar = styled(Box)(({ theme }) => ({
//   display: "flex",
//   flexDirection: "row",
//   alignContent: "center",
//   alignItems: "center",
//   gap: "0.5rem",
//   justifyContent: "space-between",
//   padding: "0.5rem",
//   color: theme.vars.palette.text.primary,
//   backgroundColor: theme.vars.palette.background.paper,
//   overflow: "hidden",
//   transition: "all 100ms ease-in-out",
//   borderBottom: `1px solid ${theme.alpha(theme.vars.palette.text.primary, 0.125)}`,
//   borderRadius: "25px 25px 0 0",
// }));

// const BottomBar = styled(Box)(({ theme }) => ({
//   alignItems: "flex-start",
//   backgroundColor: theme.vars.palette.background.paper,
//   display: "flex",
//   justifyContent: "space-between",
//   minHeight: "3.5rem",
//   overflow: "hidden",
//   position: "relative",
//   transition: "all 150ms ease-in-out",
//   zIndex: 1,
//   boxShadow: "0 1px 2px -1px rgba(97, 97, 97, 0.5) inset",
//   borderRadius: "0 0 25px 25px",
//   padding: "0 0.5rem",
// }));

// const DetailPane = styled(Box)(({ theme }) => ({
//   margin: 1,
//   fontFamily: "var(--font-interkhmerloopless)",
//   th: { background: theme.vars.palette.background.paper },
//   td: { fontFamily: "var(--font-interkhmerloopless)" },
// }));

// const AddButton = styled(Button, {
//   name: PREFIX,
//   slot: "button",
// })(({ theme }) => ({
//   borderRadius: "50px",
//   "&.MuiButton-contained": { color: theme.palette.common.white },
// }));

// const DateBox = styled("span", {
//   name: PREFIX,
//   slot: "caption",
//   shouldForwardProp: (prop: string) => prop !== "value",
// })<{ value: number }>(({ theme, value }) => ({
//   color:
//     value < 7
//       ? theme.vars.palette.text.primary
//       : value >= 7 && value < 30
//         ? theme.palette.warning.main
//         : theme.palette.error.dark,
//   borderRadius: "0.25rem",
//   maxWidth: "5ch",
//   padding: "0.25rem",
// }));

// const detailPaneHeader = [
//   { title: "លេខលិខិតដើម", color: "error" },
//   { title: "កាលបរិច្ឆេទលិខិតចូល", color: "error" },
//   { title: "ម៉ោងចូល", color: "error" },
//   { title: "រូបភាពឯកសារ", color: "error" },
//   { title: "អ្នកទទួលឯកសារ", color: "error" },
//   { title: "កំពុងប្រតិបត្តិការនៅ", color: "error" },
//   { title: "អ្នកបញ្ជូនឯកសារ", color: "error" },
//   { title: "កំណត់សម្គាល់", color: "error" },
// ];

// const RowActionMenu = ({ row }: { row: Row<BaseRecord> }) => {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);

//   const handleClick = (e: React.MouseEvent<HTMLElement>) => {
//     e.stopPropagation();
//     setAnchorEl(e.currentTarget);
//   };
//   const handleClose = (e: React.MouseEvent<HTMLElement>) => {
//     e.stopPropagation();
//     setAnchorEl(null);
//   };

//   return (
//     <Box>
//       <Tooltip title="More">
//         <span>
//           <IconButton
//             size="small"
//             onClick={handleClick}
//             disabled={!row.getIsSelected()}
//             sx={{
//               "&:hover": {
//                 cursor: !row.getIsSelected() ? "not-allowed" : "pointer",
//               },
//             }}
//           >
//             <MoreVertIcon fontSize="small" />
//           </IconButton>
//         </span>
//       </Tooltip>
//       <Menu
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         onClick={handleClose}
//         transformOrigin={{ horizontal: "right", vertical: "top" }}
//         anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//       >
//         <MenuItem onClick={handleClose}>
//           <ListItemIcon>
//             <Print fontSize="small" color="warning" />
//           </ListItemIcon>
//           <ListItemText>បោះពុម្ភ</ListItemText>
//         </MenuItem>
//         <MenuItem onClick={handleClose}>
//           <ListItemIcon>
//             <Article fontSize="small" color="secondary" />
//           </ListItemIcon>
//           <ListItemText>មើលលម្អិត</ListItemText>
//         </MenuItem>
//         <MenuItem onClick={handleClose}>
//           <ListItemIcon>
//             <AssignmentTurnedIn fontSize="small" color="success" />
//           </ListItemIcon>
//           <ListItemText>បញ្ចប់ប្រតិបត្តិការ</ListItemText>
//         </MenuItem>
//       </Menu>
//     </Box>
//   );
// };

// export default function TranslationsListPage() {
//   const { tableQuery, result, currentPage, setCurrentPage, pageSize } =
//     useTable({
//       resource: "translations",
//     });

//   const { mutate: deleteKey } = useDelete();

//   //   const rows = tableQuery.data?.data ?? [];
//   const data = result.data ?? [];

//   const [formDialogOpen, setFormDialogOpen] = useState(false);
//   const [editingRowId, setEditingRowId] = useState<number | null>(null);
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
//   const [expanded, setExpanded] = useState<ExpandedState>({});

//   const handleEdit = (id: number) => {
//     setEditingRowId(id);
//     setFormDialogOpen(true);
//   };
//   const handleDialogForm = () => setFormDialogOpen(true);
//   const handleDelete = (ids: number[] | number) => {
//     console.log("Delete row(s):", ids);
//   };

//   const columns = useMemo<ColumnDef<BaseRecord>[]>(
//     () => [
//       {
//         id: "select",
//         header: ({ table }) => (
//           <Checkbox
//             checked={table.getIsAllRowsSelected()}
//             indeterminate={table.getIsSomeRowsSelected()}
//             onChange={table.getToggleAllRowsSelectedHandler()}
//           />
//         ),
//         cell: ({ row }) => (
//           <Checkbox
//             checked={row.getIsSelected()}
//             onChange={row.getToggleSelectedHandler()}
//             onClick={(e) => e.stopPropagation()}
//           />
//         ),
//         size: 40,
//       },
//       {
//         id: "expand",
//         header: () => null,
//         cell: ({ row }) =>
//           row.original.details ? (
//             <IconButton
//               size="small"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 row.toggleExpanded();
//               }}
//             >
//               {row.getIsExpanded() ? (
//                 <KeyboardArrowDown />
//               ) : (
//                 <KeyboardArrowRight />
//               )}
//             </IconButton>
//           ) : null,
//         size: 40,
//       },
//       {
//         accessorKey: "id",
//         header: "ល.រ",
//         size: 60,
//       },
//       {
//         accessorKey: "key",
//         header: "KEY",
//       },
//       {
//         accessorKey: "description",
//         header: "Description",
//         // cell: ({ getValue }) => {
//         //   const value = getValue<string>();
//         //   return (
//         //     <Box
//         //       component="span"
//         //       sx={(theme) => ({
//         //         backgroundColor:
//         //           value === "ធម្មតា"
//         //             ? theme.palette.success.dark
//         //             : value === "ប្រញ៉ាប់"
//         //               ? theme.palette.error.dark
//         //               : theme.palette.primary.dark,
//         //         borderRadius: "0.25rem",
//         //         color: "#fff",
//         //         maxWidth: "5ch",
//         //         p: "0.25rem",
//         //       })}
//         //     >
//         //       {value}
//         //     </Box>
//         //   );
//         // },
//       },
//       {
//         accessorKey: "category",
//         header: "Category",
//         // cell: ({ getValue }) => {
//         //   const value = getValue<number>();
//         //   return (
//         //     <DateBox value={value}>
//         //       {MsgUtils.toLocaleNumerals(value, "km-KH")}ថ្ងៃ
//         //     </DateBox>
//         //   );
//         // },
//       },
//       { accessorKey: "translations", header: "Locales" },
//       {
//         id: "actions",
//         header: "Actions",
//         cell: ({ row }) => (
//           <Box
//             sx={{
//               display: "flex",
//               flexWrap: "nowrap",
//               gap: "4px",
//               justifyContent: "center",
//             }}
//           >
//             <Tooltip title="Edit">
//               <span>
//                 <IconButton
//                   size="small"
//                   color="error"
//                   disabled={!row.getIsSelected()}
//                   sx={{
//                     "&:hover": {
//                       cursor: !row.getIsSelected() ? "not-allowed" : "pointer",
//                     },
//                   }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     const id = row.original.id;
//                     if (id !== undefined) handleEdit(Number(id));
//                   }}
//                 >
//                   <EditIcon fontSize="small" />
//                 </IconButton>
//               </span>
//             </Tooltip>
//             <Tooltip title="Delete">
//               <span>
//                 <IconButton
//                   size="small"
//                   color="primary"
//                   disabled={!row.getIsSelected()}
//                   sx={{
//                     "&:hover": {
//                       cursor: !row.getIsSelected() ? "not-allowed" : "pointer",
//                     },
//                   }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     const id = row.original.id;
//                     if (id !== undefined) handleDelete(Number(id));
//                   }}
//                 >
//                   <DeleteIcon fontSize="small" />
//                 </IconButton>
//               </span>
//             </Tooltip>
//             <RowActionMenu row={row} />
//           </Box>
//         ),
//         size: 100,
//       },
//     ],
//     [],
//   );

//   const table = useDataTable({
//     columns,
//     data,
//     getRowId: (row) => (row.id ?? "").toString(),
//     enableRowSelection: true,
//     rowSelection,
//     onRowSelectionChange: setRowSelection,
//     expanded,
//     onExpandedChange: setExpanded,
//   });

//   const selectedCount = Object.keys(rowSelection).length;

//   //   const columns = [
//   //     { field: "key", headerName: "Key", flex: 1 },
//   //     { field: "description", headerName: "Description", flex: 1 },
//   //     { field: "category", headerName: "Category", width: 150 },
//   //     {
//   //       field: "translations",
//   //       headerName: "Locales",
//   //       flex: 1,
//   //       renderCell: (params: any) =>
//   //         params.value.map((t: any) => t.locale).join(", "),
//   //     },
//   //     {
//   //       field: "actions",
//   //       headerName: "Actions",
//   //       width: 200,
//   //       renderCell: (params: any) => (
//   //         <>
//   //           <Link href={`/admin/translations/edit/${params.row.id}`}>Edit</Link>
//   //           <Button
//   //             color="error"
//   //             onClick={() =>
//   //               deleteKey({ resource: "translations", id: params.row.id })
//   //             }
//   //           >
//   //             Delete
//   //           </Button>
//   //         </>
//   //       ),
//   //     },
//   //   ];

//   return (
//     <div>
//       <Link href="/admin/translations/create">
//         <Button variant="contained">Add Translation Key</Button>
//       </Link>
//       {/* <DataGrid
//           rows={rows}
//           columns={columns}
//           loading={tableQuery.isLoading}
//           getRowId={(row) => row.id}
//           paginationModel={{ page: currentPage - 1, pageSize }} // MUI is 0-indexed, Refine is 1-indexed
//           onPaginationModelChange={(model) => {
//             setCurrentPage(model.page + 1);
//             setPageSize(model.pageSize);
//           }}
//           rowCount={result.total ?? 0}
//           paginationMode="server"
//         /> */}
//       <Root>
//         <ToolBar>
//           <Box sx={{ display: "flex", gap: 1, p: 1 }}>
//             <AddButton
//               variant="contained"
//               startIcon={<Add />}
//               size="large"
//               color="error"
//               type="button"
//               onClick={handleDialogForm}
//             >
//               <Typography variant="body2">
//                 <strong>បញ្ចូលឯកសារថ្មី</strong>
//               </Typography>
//             </AddButton>
//           </Box>

//           <GlobalFilterTextField table={table} placeholder="ល.ន.ធ.ម" />

//           <Box>
//             <IconButton onClick={() => window.print()}>
//               <Print />
//             </IconButton>
//             <Tooltip title="Delete">
//               <span>
//                 <IconButton
//                   color="primary"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     const selectedIds = Object.keys(rowSelection).map((id) =>
//                       parseInt(id, 10),
//                     );
//                     handleDelete(selectedIds);
//                   }}
//                   disabled={selectedCount === 0}
//                 >
//                   <DeleteIcon />
//                 </IconButton>
//               </span>
//             </Tooltip>
//             <ShowHideColumnsButton table={table} />
//             <FullScreenToggleButton
//               isFullScreen={isFullScreen}
//               onToggle={() => setIsFullScreen((p) => !p)}
//             />
//           </Box>
//         </ToolBar>

//         <DataTable
//           table={table}
//           renderDetailPanel={(row: Row<BaseRecord>) => {
//             const details = row.original.details;
//             return (
//               <DetailPane>
//                 <Typography variant="h6" gutterBottom>
//                   លម្អិត
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" mb={2}>
//                   {row.original.description}
//                 </Typography>
//                 {details && (
//                   <TableContainer component={Paper} elevation={1}>
//                     <Table size="small">
//                       <TableHead>
//                         <TableRow>
//                           {detailPaneHeader.map((column) => (
//                             <TableCell key={column.title}>
//                               <Typography variant="body2" color={column.color}>
//                                 <strong>{column.title}</strong>
//                               </Typography>
//                             </TableCell>
//                           ))}
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         <TableRow>
//                           <TableCell>{details.originId}</TableCell>
//                           {/* <TableCell>
//                             {details.acceptedDate ? (
//                               formatLocaleDate(new Date(details.acceptedDate))
//                             ) : (
//                               <NAIcon fontSize="large" color="primary" />
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             {details.acceptedTime ? (
//                               formatLocalTime(
//                                 parse(
//                                   details.acceptedTime,
//                                   "h:mm a",
//                                   new Date(),
//                                 ),
//                               )
//                             ) : (
//                               <NAIcon fontSize="large" color="primary" />
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             {!details.originDoc ? (
//                               <ImageNotSupported color="primary" />
//                             ) : (
//                               <Link href={details.finishedDoc} target="_blank">
//                                 <PictureAsPdf />
//                                 រូបភាពឯកសារដើម
//                               </Link>
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             {RenderAvatar({
//                               children: details.recieptant,
//                               src: "https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8",
//                               alt: "avatar",
//                             })}
//                           </TableCell>
//                           <TableCell>{details.currentProcessor}</TableCell>
//                           <TableCell>
//                             {RenderAvatar({
//                               children: details.recievedBy,
//                               src: "https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8",
//                               alt: "avatar",
//                             })}
//                           </TableCell>
//                           <TableCell>{details.note}</TableCell> */}
//                         </TableRow>
//                       </TableBody>
//                       {/* <TableHead>
//                         <TableRow>
//                           {detailPaneHeader_2.map((column) => (
//                             <TableCell key={column.title}>
//                               <Typography variant="body2" color={column.color}>
//                                 <strong>{column.title}</strong>
//                               </Typography>
//                             </TableCell>
//                           ))}
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         <TableRow>
//                           <TableCell>
//                             {RenderAvatar({
//                               children: details.retrievedBy,
//                               src: "https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8",
//                               alt: "avatar",
//                             })}
//                           </TableCell>
//                           <TableCell>
//                             {details.retreivedDate ? (
//                               formatLocaleDate(new Date(details.retreivedDate))
//                             ) : (
//                               <NAIcon fontSize="large" color="primary" />
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             {RenderAvatar({
//                               children: details.stampedBy,
//                               src: "https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8",
//                               alt: "avatar",
//                             })}
//                           </TableCell>
//                           <TableCell>
//                             {details.stampedDate ? (
//                               formatLocaleDate(new Date(details.stampedDate))
//                             ) : (
//                               <NAIcon fontSize="large" color="primary" />
//                             )}
//                           </TableCell>
//                           <TableCell>{details.issuanceNumber}</TableCell>
//                           <TableCell>
//                             {details.issuanceDate ? (
//                               formatLocaleDate(new Date(details.issuanceDate))
//                             ) : (
//                               <NAIcon fontSize="large" color="primary" />
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             {RenderAvatar({
//                               children: details.lastRecipient,
//                               src: "https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8",
//                               alt: "avatar",
//                             })}
//                           </TableCell>
//                           <TableCell>
//                             {!details.finishedDoc ? (
//                               <ImageNotSupported color="primary" />
//                             ) : (
//                               <Link href={details.finishedDoc} target="_blank">
//                                 <PictureAsPdf />
//                                 រូបភាពឯកសារបញ្ចប់
//                               </Link>
//                             )}
//                           </TableCell>
//                         </TableRow>
//                       </TableBody>
//                       <TableHead>
//                         <TableRow>
//                           {detailPaneHeader_3.map((column) => (
//                             <TableCell key={column.title} colSpan={column.span}>
//                               <Typography variant="body2" color={column.color}>
//                                 <strong>{column.title}</strong>
//                               </Typography>
//                             </TableCell>
//                           ))}
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         <TableRow>
//                           <TableCell colSpan={2}>{details.shelveNo}</TableCell>
//                           <TableCell colSpan={3}>{details.archiveNo}</TableCell>
//                           <TableCell colSpan={3}>
//                             {details.docSequence}
//                           </TableCell>
//                         </TableRow>
//                       </TableBody> */}
//                     </Table>
//                   </TableContainer>
//                 )}
//               </DetailPane>
//             );
//           }}
//         />

//         <BottomBar>
//           {selectedCount > 0 && (
//             <Typography variant="body2" sx={{ p: 1 }}>
//               {selectedCount} row(s) selected
//             </Typography>
//           )}
//           <Box sx={{ marginLeft: "auto" }}>
//             <TablePaginationBar table={table} />
//           </Box>
//         </BottomBar>

//         <DocumentFormDialog
//           open={formDialogOpen}
//           onClose={() => setFormDialogOpen(false)}
//           initialData={editingRowId}
//         />
//       </Root>
//     </div>
//   );
// }

// // export interface Data {
// //   id: number;
// //   key: string;
// //   description: string;
// //   category: number;
// //   translations: string;
// //   details?: {
// //     originId?: string;
// //     acceptedDate: string;
// //     acceptedTime: string;
// //     originDoc?: string;
// //     recieptant: string;
// //     currentProcessor: string;
// //     deliverBy: string;
// //     note?: string;
// //     recievedBy: string;
// //     retrievedBy: string;
// //     retreivedDate: string;
// //     stampedBy?: string;
// //     stampedDate?: string;
// //     issuanceNumber?: string;
// //     issuanceDate?: string;
// //     lastRecipient: string;
// //     finishedDoc?: string;
// //     shelveNo?: string;
// //     archiveNo?: string;
// //     docSequence?: string;
// //   };
// // }

// src/app/(protected)/verify-id/page.tsx — simplified sketch
"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifySchema, VerifyValues } from "@/schema/auth.schema";
import { FormProvider, useForm } from "react-hook-form";
import hybridResolver from "@/lib/validations/hybridResolver";
import { useAsyncFieldRule } from "@/lib/hooks/useFieldValidation";
import { AsyncMap } from "@/types/auth";
import { styled } from "@mui/material/styles";
import TextField from "@/components/inputs/textfield";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Button from "@mui/material/Button";
import { useCreate } from "@refinedev/core";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";

const PREFIX = "RazethVerifyIdForm";

export const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column", // Stack the toolbar spacer and the form area vertically
  // height: "100dvh", // Fill the entire screen height
  // alignItems: "center",
  // justifyContent: "center",
  // ...theme.mixins.toolbar,
  // minHeight: "calc(100vh - 120px)", // Forces full screen space minus header
  width: "100%",
  boxSizing: "border-box",
  overflow: "hidden", // Prevents accidental sub-pixel scrolling
  // 1. Leverage the mixin as a pseudo-element before your content
  // "&::before": {
  //   content: '""',
  //   display: "block",
  //   ...theme.mixins.toolbar, // Dynamically matches the AppBar height responsively
  // },
  // Calculates height by subtracting BOTH dense toolbars (48px + 48px = 96px) from the viewport
  height: "calc(100dvh - 155px)",

  // Pushes the entire centered block down so it starts right below your stacked AppBar
  // marginTop: "96px",

  // Adjust coordinates if MUI responsive dense layouts change on smaller breakpoints
  [theme.breakpoints.down("sm")]: {
    height: "calc(100dvh - 96px)",
    marginTop: "96px",
  },
}));

export const FormContainer = styled("form", {
  name: PREFIX,
  slot: "Form",
  overridesResolver: (_props, styles) => styles.form,
})(({ theme }) => ({
  //   width: "100%",
  //   maxWidth: 420,
  // animation: `${mode === "signin" ? fadeIn : fadeOut} 0.75s ease`,
  // ["& .MuiCardContent-root"]: {
  //   minWidth: 300,
  //   padding: `${theme.spacing(0)}`,
  // },
  display: "flex",
  flexDirection: "row", // Stack the input, error, and button vertically
  alignItems: "center", // Center items horizontally
  // alignItems: "flex-start", // 👈 Change "center" to "flex-start"
  justifyContent: "center", // Center items vertically
  flexGrow: 1, // Fills all remaining space below the toolbar offset
  // minHeight: "calc(100vh - 120px)", // Fills the remaining screen space below your navigation bar
  width: "100%",
  maxWidth: 600, // Prevents the fullWidth input from stretching too wide
  margin: "0 auto", // Centers the entire form block container horizontally
  gap: theme.spacing(2), // Automatically creates clean spacing between elements
  padding: theme.spacing(3),
  // boxSizing: "border-box",
}));

const ButtonContainer = styled(Box, {
  name: PREFIX,
  slot: "ButtonContainer",
  overridesResolver: (_props, styles) => styles.buttonContainer,
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column", // Stack the input, error, and button h
}));

const ButtonWrapper = styled(Box, {
  name: PREFIX,
  slot: "ButtonWrapper",
  overridesResolver: (_props, styles) => styles.buttonWrapper,
})(({ theme }) => ({
  height: "100%",
  display: "flex",
  alignItems: "center",
}));

export default function VerifyIdPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const [officialId, setOfficialId] = useState("");
  // const [error, setError] = useState<string | null>(null);
  // const [loading, setLoading] = useState(false);

  const { validate: officialIdValidate } = useAsyncFieldRule("officialId");

  const asyncMap = useMemo(
    () => ({ officialId: officialIdValidate }) as AsyncMap,
    [officialIdValidate],
  );

  const schema = verifySchema;

  const form = useForm({
    resolver: hybridResolver(schema, asyncMap),
    mode: "onChange",
    defaultValues: {
      officialId: "",
    },
  });

  // Intercept typing updates and instantly wipe out any letters
  const currentId = form.watch("officialId");
  // useMemo(() => {
  //   if (currentId && /[^0-9]/.test(currentId)) {
  //     form.setValue("officialId", currentId.replace(/[^0-9]/g, ""), {
  //       shouldValidate: true,
  //     });
  //   }
  // }, [currentId, form]);
  useEffect(() => {
    if (currentId && /[^0-9]/.test(currentId)) {
      form.setValue("officialId", currentId.replace(/[^0-9]/g, ""), {
        shouldValidate: true,
      });
    }
  }, [currentId, form]);

  const {
    mutate: create,
    mutation: { isPending },
  } = useCreate();

  const {
    handleSubmit,
    formState: { errors, isValid, isValidating, isSubmitting },
  } = form;

  // const isSubmitting = isPending || isRegisterPending;
  const isReady = isValid && !isValidating && !isPending && !isSubmitting;
  // console.log("isSubmitting", isSubmitting);
  // console.log("isPending", isPending);
  // console.log("isValid", isValid);
  // console.log("isValidating", isValidating);

  // console.log("isReady", isReady);

  // Check if officialId field has an error
  const hasError = Boolean(errors.officialId);
  // console.log("hasError", hasError);
  console.log("errors", errors);

  const onSubmit = async (values: VerifyValues) => {
    // e.preventDefault();
    // setLoading(true);
    // setError(null);

    create(
      {
        resource: "api/account/link-employee", // Target backend API resource route
        values: values,
      },
      {
        onSuccess: (data) => {
          // if (!data.success) {
          //   // handle error
          //   console.error("Registration failed:", data.error);
          //   return;
          // }

          const callbackUrl = searchParams.get("callbackUrl");
          router.replace(
            callbackUrl ? decodeURIComponent(callbackUrl) : "/fts",
          );
        },
        onError: (err: any) => {
          // setError(err?.message ?? "Verification failed");
        },
      },
    );

    // try {
    //   await axiosInstance.post(`${API_URL}/account/link-employee`, {
    //     values,
    //   });
    //   const callbackUrl = searchParams.get("callbackUrl");
    //   router.replace(callbackUrl ? decodeURIComponent(callbackUrl) : "/fts");
    //   // router.replace("/fts");
    // } catch (err: any) {
    //   setError(err.response?.data?.message ?? "Verification failed");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <Root>
      <FormProvider {...form}>
        <FormContainer
          onSubmit={handleSubmit(onSubmit)}
          // className={className}
          // sx={sx}
          // {...rest}
        >
          <TextField
            name="officialId"
            label="អត្តលេខមន្រ្តីរាជការ"
            required
            iconStart={<AccountBoxIcon />}
            fullWidth
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
                pattern: "[0-9]*",
              },
            }} // Brings up the numeric keypad on mobile devices
            onKeyDown={(e) => {
              if (!/[0-9]|Backspace|Delete|Arrow/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
          {/* <input
          value={officialId}
          onChange={(e) => setOfficialId(e.target.value)}
          placeholder="Enter your 10-digit Employee ID"
          maxLength={10}
        /> */}
          {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
          {/* <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button> */}
          <ButtonContainer>
            <ButtonWrapper>
              <Button
                loading={isPending}
                disabled={!isReady}
                type="submit" // Crucial fix: explicitly enables form submission
                variant="contained" // Gives the button background color
              >
                {isPending ? "កំពុងផ្ទៀងផ្ទាត់..." : "ផ្ទៀងផ្ទាត់"}
              </Button>
            </ButtonWrapper>
            {/* Dummy spacer matches MUI's error text height perfectly */}
            {hasError && (
              <FormHelperText sx={{ visibility: "hidden" }}>
                &nbsp;
              </FormHelperText>
            )}
          </ButtonContainer>
        </FormContainer>
      </FormProvider>
    </Root>
  );
}
