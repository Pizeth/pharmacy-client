// src/components/Tables/DocumentTable.tsx
"use client";
import React, { useMemo, useState } from "react";
import type {
  ColumnDef,
  Row,
  RowSelectionState,
  ExpandedState,
} from "@tanstack/react-table";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Button,
  Checkbox,
  styled,
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
import { parse } from "date-fns";

import generateRows, { Data } from "../fts/mockData";
import DocumentFormDialog from "../fts/dialogForm";
import RenderAvatar from "../CustomComponents/ColunmAvatar";
import MsgUtils from "@/utils/msgUtils";
import formatLocaleDate, { formatLocalTime } from "@/utils/dateUtils";
import NAIcon from "../icons/na";
import { DataTable, useDataTable } from "../DataTable/DataTable";

import {
  GlobalFilterTextField,
  TablePaginationBar,
  ShowHideColumnsButton,
  FullScreenToggleButton,
} from "../DataTable/DataTableToolbars";

const PREFIX = "RazethTable";

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

const detailPaneHeader_1 = [
  { title: "លេខលិខិតដើម", color: "error" },
  { title: "កាលបរិច្ឆេទលិខិតចូល", color: "error" },
  { title: "ម៉ោងចូល", color: "error" },
  { title: "រូបភាពឯកសារ", color: "error" },
  { title: "អ្នកទទួលឯកសារ", color: "error" },
  { title: "កំពុងប្រតិបត្តិការនៅ", color: "error" },
  { title: "អ្នកបញ្ជូនឯកសារ", color: "error" },
  { title: "កំណត់សម្គាល់", color: "error" },
];
const detailPaneHeader_2 = [
  { title: "អ្នកទទួលឯកសារពីខុទ្ទកាល័យ", color: "error" },
  { title: "កាលបរិច្ឆេទទទួលឯកសារ", color: "error" },
  { title: "អ្នកប្រថាប់ត្រា", color: "error" },
  { title: "កាលបរិច្ឆេទប្រថាប់ត្រា", color: "error" },
  { title: "លេខលិខិតចេញ", color: "error" },
  { title: "កាលបរិច្ឆេទបញ្ជូនចេញ", color: "error" },
  { title: "អ្នកទទួលឯកសារចេញ", color: "error" },
  { title: "រូបភាពឯកសារបញ្ចប់", color: "error" },
];
const detailPaneHeader_3 = [
  { title: "លេខទូរ", color: "error", span: 2 },
  { title: "លេខក្រូណូ", color: "error", span: 3 },
  { title: "លេខរៀងឯកសារ", color: "error", span: 3 },
];

const data = generateRows(200);

const RowActionMenu = ({ row }: { row: Row<Data> }) => {
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

export default function DocumentTable() {
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

  const columns = useMemo<ColumnDef<Data>[]>(
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
        header: "ល.រ នធម",
        size: 60,
      },
      {
        accessorKey: "title",
        header: "ឈ្មោះឯកសារ",
      },
      {
        accessorKey: "status",
        header: "ស្ថានភាព",
        cell: ({ getValue }) => {
          const value = getValue<string>();
          return (
            <Box
              component="span"
              sx={(theme) => ({
                backgroundColor:
                  value === "ធម្មតា"
                    ? theme.palette.success.dark
                    : value === "ប្រញ៉ាប់"
                      ? theme.palette.error.dark
                      : theme.palette.primary.dark,
                borderRadius: "0.25rem",
                color: "#fff",
                maxWidth: "5ch",
                p: "0.25rem",
              })}
            >
              {value}
            </Box>
          );
        },
      },
      {
        accessorKey: "days",
        header: "ចំនួនថ្ងៃ",
        cell: ({ getValue }) => {
          const value = getValue<number>();
          return (
            <DateBox value={value}>
              {MsgUtils.toLocaleNumerals(value, "km-KH")}ថ្ងៃ
            </DateBox>
          );
        },
      },
      { accessorKey: "types", header: "ប្រភេទឯកសារ" },
      { accessorKey: "categories", header: "ឯកសារ" },
      { accessorKey: "office", header: "ការិយាល័យទទួលបន្ទុក" },
      {
        id: "actions",
        header: "ចំណាត់ការឯកសារ",
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
                    handleEdit(row.original.id);
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
                    handleDelete(row.original.id);
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
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    expanded,
    onExpandedChange: setExpanded,
  });

  // Set initial page size to 100 to match your original initialState
  React.useEffect(() => {
    table.setPageSize(100);
  }, [table]);

  const selectedCount = Object.keys(rowSelection).length;

  return (
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
        renderDetailPanel={(row: Row<Data>) => {
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
                        {detailPaneHeader_1.map((column) => (
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
                        <TableCell>
                          {details.acceptedDate ? (
                            formatLocaleDate(new Date(details.acceptedDate))
                          ) : (
                            <NAIcon fontSize="large" color="primary" />
                          )}
                        </TableCell>
                        <TableCell>
                          {details.acceptedTime ? (
                            formatLocalTime(
                              parse(details.acceptedTime, "h:mm a", new Date()),
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
                        <TableCell>{details.note}</TableCell>
                      </TableRow>
                    </TableBody>
                    <TableHead>
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
                        <TableCell colSpan={3}>{details.docSequence}</TableCell>
                      </TableRow>
                    </TableBody>
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
  );
}
