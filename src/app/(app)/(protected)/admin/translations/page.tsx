// src/app/(protected)/admin/translations/page.tsx
"use client";
import { useTable, useDelete, BaseRecord } from "@refinedev/core";
// import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Print,
  Article,
  AssignmentTurnedIn,
  Add,
  PictureAsPdf,
  ImageNotSupported,
  KeyboardArrowDown,
  KeyboardArrowRight,
} from "@mui/icons-material";
import Link from "next/link";
import {
  ColumnDef,
  ExpandedState,
  Row,
  RowSelectionState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
  FullScreenToggleButton,
  GlobalFilterTextField,
  ShowHideColumnsButton,
  TablePaginationBar,
} from "@/components/DataTable/DataTableToolbars";
import DataTable, { useDataTable } from "@/components/DataTable/DataTable";
import DocumentFormDialog from "@/components/fts/dialogForm";

const PREFIX = "RazethTranslationsListPage";

const Root = styled(Box)(({ theme }) => ({
  width: "100%",
  border: `1px solid ${theme.alpha(theme.vars.palette.text.primary, 0.125)}`,
  borderRadius: "25px",
}));

const ToolBar = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignContent: "center",
  alignItems: "center",
  gap: "0.5rem",
  justifyContent: "space-between",
  padding: "0.5rem",
  color: theme.vars.palette.text.primary,
  backgroundColor: theme.vars.palette.background.paper,
  overflow: "hidden",
  transition: "all 100ms ease-in-out",
  borderBottom: `1px solid ${theme.alpha(theme.vars.palette.text.primary, 0.125)}`,
  borderRadius: "25px 25px 0 0",
}));

const BottomBar = styled(Box)(({ theme }) => ({
  alignItems: "flex-start",
  backgroundColor: theme.vars.palette.background.paper,
  display: "flex",
  justifyContent: "space-between",
  minHeight: "3.5rem",
  overflow: "hidden",
  position: "relative",
  transition: "all 150ms ease-in-out",
  zIndex: 1,
  boxShadow: "0 1px 2px -1px rgba(97, 97, 97, 0.5) inset",
  borderRadius: "0 0 25px 25px",
  padding: "0 0.5rem",
}));

const DetailPane = styled(Box)(({ theme }) => ({
  margin: 1,
  fontFamily: "var(--font-interkhmerloopless)",
  th: { background: theme.vars.palette.background.paper },
  td: { fontFamily: "var(--font-interkhmerloopless)" },
}));

const AddButton = styled(Button, {
  name: PREFIX,
  slot: "button",
})(({ theme }) => ({
  borderRadius: "50px",
  "&.MuiButton-contained": { color: theme.palette.common.white },
}));

const DateBox = styled("span", {
  name: PREFIX,
  slot: "caption",
  shouldForwardProp: (prop: string) => prop !== "value",
})<{ value: number }>(({ theme, value }) => ({
  color:
    value < 7
      ? theme.vars.palette.text.primary
      : value >= 7 && value < 30
        ? theme.palette.warning.main
        : theme.palette.error.dark,
  borderRadius: "0.25rem",
  maxWidth: "5ch",
  padding: "0.25rem",
}));

const detailPaneHeader = [
  { title: "លេខលិខិតដើម", color: "error" },
  { title: "កាលបរិច្ឆេទលិខិតចូល", color: "error" },
  { title: "ម៉ោងចូល", color: "error" },
  { title: "រូបភាពឯកសារ", color: "error" },
  { title: "អ្នកទទួលឯកសារ", color: "error" },
  { title: "កំពុងប្រតិបត្តិការនៅ", color: "error" },
  { title: "អ្នកបញ្ជូនឯកសារ", color: "error" },
  { title: "កំណត់សម្គាល់", color: "error" },
];

const RowActionMenu = ({ row }: { row: Row<BaseRecord> }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <Box>
      <Tooltip title="More">
        <span>
          <IconButton
            size="small"
            onClick={handleClick}
            disabled={!row.getIsSelected()}
            sx={{
              "&:hover": {
                cursor: !row.getIsSelected() ? "not-allowed" : "pointer",
              },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Print fontSize="small" color="warning" />
          </ListItemIcon>
          <ListItemText>បោះពុម្ភ</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Article fontSize="small" color="secondary" />
          </ListItemIcon>
          <ListItemText>មើលលម្អិត</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AssignmentTurnedIn fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>បញ្ចប់ប្រតិបត្តិការ</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default function TranslationsListPage() {
  const { tableQuery, result, currentPage, setCurrentPage, pageSize } =
    useTable({
      resource: "translations",
    });

  const { mutate: deleteKey } = useDelete();

  //   const rows = tableQuery.data?.data ?? [];
  const data = result.data ?? [];

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const handleEdit = (id: number) => {
    setEditingRowId(id);
    setFormDialogOpen(true);
  };
  const handleDialogForm = () => setFormDialogOpen(true);
  const handleDelete = (ids: number[] | number) => {
    console.log("Delete row(s):", ids);
  };

  const columns = useMemo<ColumnDef<BaseRecord>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            onClick={(e) => e.stopPropagation()}
          />
        ),
        size: 40,
      },
      {
        id: "expand",
        header: () => null,
        cell: ({ row }) =>
          row.original.details ? (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                row.toggleExpanded();
              }}
            >
              {row.getIsExpanded() ? (
                <KeyboardArrowDown />
              ) : (
                <KeyboardArrowRight />
              )}
            </IconButton>
          ) : null,
        size: 40,
      },
      {
        accessorKey: "id",
        header: "ល.រ",
        size: 60,
      },
      {
        accessorKey: "key",
        header: "KEY",
      },
      {
        accessorKey: "description",
        header: "Description",
        // cell: ({ getValue }) => {
        //   const value = getValue<string>();
        //   return (
        //     <Box
        //       component="span"
        //       sx={(theme) => ({
        //         backgroundColor:
        //           value === "ធម្មតា"
        //             ? theme.palette.success.dark
        //             : value === "ប្រញ៉ាប់"
        //               ? theme.palette.error.dark
        //               : theme.palette.primary.dark,
        //         borderRadius: "0.25rem",
        //         color: "#fff",
        //         maxWidth: "5ch",
        //         p: "0.25rem",
        //       })}
        //     >
        //       {value}
        //     </Box>
        //   );
        // },
      },
      {
        accessorKey: "category",
        header: "Category",
        // cell: ({ getValue }) => {
        //   const value = getValue<number>();
        //   return (
        //     <DateBox value={value}>
        //       {MsgUtils.toLocaleNumerals(value, "km-KH")}ថ្ងៃ
        //     </DateBox>
        //   );
        // },
      },
      { accessorKey: "translations", header: "Locales" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Box
            sx={{
              display: "flex",
              flexWrap: "nowrap",
              gap: "4px",
              justifyContent: "center",
            }}
          >
            <Tooltip title="Edit">
              <span>
                <IconButton
                  size="small"
                  color="error"
                  disabled={!row.getIsSelected()}
                  sx={{
                    "&:hover": {
                      cursor: !row.getIsSelected() ? "not-allowed" : "pointer",
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const id = row.original.id;
                    if (id !== undefined) handleEdit(Number(id));
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Delete">
              <span>
                <IconButton
                  size="small"
                  color="primary"
                  disabled={!row.getIsSelected()}
                  sx={{
                    "&:hover": {
                      cursor: !row.getIsSelected() ? "not-allowed" : "pointer",
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const id = row.original.id;
                    if (id !== undefined) handleDelete(Number(id));
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <RowActionMenu row={row} />
          </Box>
        ),
        size: 100,
      },
    ],
    [],
  );

  const table = useDataTable({
    columns,
    data,
    getRowId: (row) => (row.id ?? "").toString(),
    enableRowSelection: true,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    expanded,
    onExpandedChange: setExpanded,
  });

  const selectedCount = Object.keys(rowSelection).length;

  //   const columns = [
  //     { field: "key", headerName: "Key", flex: 1 },
  //     { field: "description", headerName: "Description", flex: 1 },
  //     { field: "category", headerName: "Category", width: 150 },
  //     {
  //       field: "translations",
  //       headerName: "Locales",
  //       flex: 1,
  //       renderCell: (params: any) =>
  //         params.value.map((t: any) => t.locale).join(", "),
  //     },
  //     {
  //       field: "actions",
  //       headerName: "Actions",
  //       width: 200,
  //       renderCell: (params: any) => (
  //         <>
  //           <Link href={`/admin/translations/edit/${params.row.id}`}>Edit</Link>
  //           <Button
  //             color="error"
  //             onClick={() =>
  //               deleteKey({ resource: "translations", id: params.row.id })
  //             }
  //           >
  //             Delete
  //           </Button>
  //         </>
  //       ),
  //     },
  //   ];

  return (
    <div>
      <Link href="/admin/translations/create">
        <Button variant="contained">Add Translation Key</Button>
      </Link>
      {/* <DataGrid
          rows={rows}
          columns={columns}
          loading={tableQuery.isLoading}
          getRowId={(row) => row.id}
          paginationModel={{ page: currentPage - 1, pageSize }} // MUI is 0-indexed, Refine is 1-indexed
          onPaginationModelChange={(model) => {
            setCurrentPage(model.page + 1);
            setPageSize(model.pageSize);
          }}
          rowCount={result.total ?? 0}
          paginationMode="server"
        /> */}
      <Root>
        <ToolBar>
          <Box sx={{ display: "flex", gap: 1, p: 1 }}>
            <AddButton
              variant="contained"
              startIcon={<Add />}
              size="large"
              color="error"
              type="button"
              onClick={handleDialogForm}
            >
              <Typography variant="body2">
                <strong>បញ្ចូលឯកសារថ្មី</strong>
              </Typography>
            </AddButton>
          </Box>

          <GlobalFilterTextField table={table} placeholder="ល.ន.ធ.ម" />

          <Box>
            <IconButton onClick={() => window.print()}>
              <Print />
            </IconButton>
            <Tooltip title="Delete">
              <span>
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    const selectedIds = Object.keys(rowSelection).map((id) =>
                      parseInt(id, 10),
                    );
                    handleDelete(selectedIds);
                  }}
                  disabled={selectedCount === 0}
                >
                  <DeleteIcon />
                </IconButton>
              </span>
            </Tooltip>
            <ShowHideColumnsButton table={table} />
            <FullScreenToggleButton
              isFullScreen={isFullScreen}
              onToggle={() => setIsFullScreen((p) => !p)}
            />
          </Box>
        </ToolBar>

        <DataTable
          table={table}
          renderDetailPanel={(row: Row<BaseRecord>) => {
            const details = row.original.details;
            return (
              <DetailPane>
                <Typography variant="h6" gutterBottom>
                  លម្អិត
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {row.original.description}
                </Typography>
                {details && (
                  <TableContainer component={Paper} elevation={1}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {detailPaneHeader.map((column) => (
                            <TableCell key={column.title}>
                              <Typography variant="body2" color={column.color}>
                                <strong>{column.title}</strong>
                              </Typography>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{details.originId}</TableCell>
                          {/* <TableCell>
                            {details.acceptedDate ? (
                              formatLocaleDate(new Date(details.acceptedDate))
                            ) : (
                              <NAIcon fontSize="large" color="primary" />
                            )}
                          </TableCell>
                          <TableCell>
                            {details.acceptedTime ? (
                              formatLocalTime(
                                parse(
                                  details.acceptedTime,
                                  "h:mm a",
                                  new Date(),
                                ),
                              )
                            ) : (
                              <NAIcon fontSize="large" color="primary" />
                            )}
                          </TableCell>
                          <TableCell>
                            {!details.originDoc ? (
                              <ImageNotSupported color="primary" />
                            ) : (
                              <Link href={details.finishedDoc} target="_blank">
                                <PictureAsPdf />
                                រូបភាពឯកសារដើម
                              </Link>
                            )}
                          </TableCell>
                          <TableCell>
                            {RenderAvatar({
                              children: details.recieptant,
                              src: "https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8",
                              alt: "avatar",
                            })}
                          </TableCell>
                          <TableCell>{details.currentProcessor}</TableCell>
                          <TableCell>
                            {RenderAvatar({
                              children: details.recievedBy,
                              src: "https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8",
                              alt: "avatar",
                            })}
                          </TableCell>
                          <TableCell>{details.note}</TableCell> */}
                        </TableRow>
                      </TableBody>
                      {/* <TableHead>
                        <TableRow>
                          {detailPaneHeader_2.map((column) => (
                            <TableCell key={column.title}>
                              <Typography variant="body2" color={column.color}>
                                <strong>{column.title}</strong>
                              </Typography>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            {RenderAvatar({
                              children: details.retrievedBy,
                              src: "https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8",
                              alt: "avatar",
                            })}
                          </TableCell>
                          <TableCell>
                            {details.retreivedDate ? (
                              formatLocaleDate(new Date(details.retreivedDate))
                            ) : (
                              <NAIcon fontSize="large" color="primary" />
                            )}
                          </TableCell>
                          <TableCell>
                            {RenderAvatar({
                              children: details.stampedBy,
                              src: "https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8",
                              alt: "avatar",
                            })}
                          </TableCell>
                          <TableCell>
                            {details.stampedDate ? (
                              formatLocaleDate(new Date(details.stampedDate))
                            ) : (
                              <NAIcon fontSize="large" color="primary" />
                            )}
                          </TableCell>
                          <TableCell>{details.issuanceNumber}</TableCell>
                          <TableCell>
                            {details.issuanceDate ? (
                              formatLocaleDate(new Date(details.issuanceDate))
                            ) : (
                              <NAIcon fontSize="large" color="primary" />
                            )}
                          </TableCell>
                          <TableCell>
                            {RenderAvatar({
                              children: details.lastRecipient,
                              src: "https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8",
                              alt: "avatar",
                            })}
                          </TableCell>
                          <TableCell>
                            {!details.finishedDoc ? (
                              <ImageNotSupported color="primary" />
                            ) : (
                              <Link href={details.finishedDoc} target="_blank">
                                <PictureAsPdf />
                                រូបភាពឯកសារបញ្ចប់
                              </Link>
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                      <TableHead>
                        <TableRow>
                          {detailPaneHeader_3.map((column) => (
                            <TableCell key={column.title} colSpan={column.span}>
                              <Typography variant="body2" color={column.color}>
                                <strong>{column.title}</strong>
                              </Typography>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={2}>{details.shelveNo}</TableCell>
                          <TableCell colSpan={3}>{details.archiveNo}</TableCell>
                          <TableCell colSpan={3}>
                            {details.docSequence}
                          </TableCell>
                        </TableRow>
                      </TableBody> */}
                    </Table>
                  </TableContainer>
                )}
              </DetailPane>
            );
          }}
        />

        <BottomBar>
          {selectedCount > 0 && (
            <Typography variant="body2" sx={{ p: 1 }}>
              {selectedCount} row(s) selected
            </Typography>
          )}
          <Box sx={{ marginLeft: "auto" }}>
            <TablePaginationBar table={table} />
          </Box>
        </BottomBar>

        <DocumentFormDialog
          open={formDialogOpen}
          onClose={() => setFormDialogOpen(false)}
          initialData={editingRowId}
        />
      </Root>
    </div>
  );
}

// export interface Data {
//   id: number;
//   key: string;
//   description: string;
//   category: number;
//   translations: string;
//   details?: {
//     originId?: string;
//     acceptedDate: string;
//     acceptedTime: string;
//     originDoc?: string;
//     recieptant: string;
//     currentProcessor: string;
//     deliverBy: string;
//     note?: string;
//     recievedBy: string;
//     retrievedBy: string;
//     retreivedDate: string;
//     stampedBy?: string;
//     stampedDate?: string;
//     issuanceNumber?: string;
//     issuanceDate?: string;
//     lastRecipient: string;
//     finishedDoc?: string;
//     shelveNo?: string;
//     archiveNo?: string;
//     docSequence?: string;
//   };
// }
