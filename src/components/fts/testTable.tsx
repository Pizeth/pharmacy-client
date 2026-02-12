import React, { useMemo, useState } from "react";
// Assuming Next.js, swap if using react-router-dom
// import { useRouter } from "next/router";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Print,
  Article,
  AssignmentTurnedIn,
  SearchOutlined as SearchOutlinedIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import generateRows, { Data } from "./mockData";

// --- Types ---
// export interface DocumentDetails {
//   originId: string;
//   acceptedDate: string;
//   acceptedTime: string;
//   originDoc: string;
//   recieptant: string;
//   currentProcessor: string;
//   recievedBy: string;
//   retreivedDate: string;
//   stampedBy: string;
//   stampedDate: string;
//   issuanceNumber: string;
//   issuanceDate: string;
//   lastRecipient: string;
//   finishedDoc: string;
//   shelveNo: string;
//   archiveNo: string;
//   docSequence: string;
// }

// export interface Data {
//   id: number;
//   title: string;
//   status: string;
//   days: number;
//   types: string;
//   categories: string;
//   office: string;
//   description: string;
//   details?: DocumentDetails;
// }

// // --- Mock Data (Replace with your actual fetch logic) ---
// const mockData: Data[] = [
//   {
//     id: 1,
//     title: "សេចក្តីព្រាងច្បាប់",
//     status: "កំពុងដំណើរការ",
//     days: 5,
//     types: "ច្បាប់",
//     categories: "ឯកសាររដ្ឋបាល",
//     office: "ការិយាល័យកណ្តាល",
//     description: "នេះគឺជាការពិពណ៌នាលម្អិតអំពីសេចក្តីព្រាងច្បាប់នេះ។",
//     details: {
//       originId: "១២៣៤៥",
//       acceptedDate: "2024-01-01",
//       acceptedTime: "08:30 AM",
//       originDoc: "https://example.com/doc1",
//       recieptant: "មន្រ្តី ក",
//       currentProcessor: "ប្រធាននាយកដ្ឋាន",
//       recievedBy: "បុគ្គលិក ខ",
//       retreivedDate: "2024-01-02",
//       stampedBy: "មន្ត្រីគណនេយ្យ",
//       stampedDate: "2024-01-03",
//       issuanceNumber: "០០១/២៤",
//       issuanceDate: "2024-01-04",
//       lastRecipient: "មន្រ្តី គ",
//       finishedDoc: "https://example.com/doc1_final",
//       shelveNo: "A-01",
//       archiveNo: "AR-2024-001",
//       docSequence: "00001",
//     },
//   },
// ];

// --- Custom Action Menu Component ---
// Extracted to manage its own anchorEl state for the MoreVert menu
const RowActionMenu = ({ row }: { row: any }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation(); // Prevent row click event
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="More">
        <IconButton size="small" onClick={handleClick}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Print fontSize="small" color="warning" />
          </ListItemIcon>
          <ListItemText>បោះពុម្ភ</ListItemText>
          <Typography variant="body2" color="text.secondary" ml={2}>
            ⌘+P
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Article fontSize="small" color="secondary" />
          </ListItemIcon>
          <ListItemText>មើលលម្អិត</ListItemText>
          <Typography variant="body2" color="text.secondary" ml={2}>
            ⌘+D
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AssignmentTurnedIn fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>បញ្ចប់ប្រតិបត្តិការ</ListItemText>
          <Typography variant="body2" color="text.secondary" ml={2}>
            ⌘+F
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

const data = generateRows(200);

// --- Main Table Component ---
export default function DocumentTable() {
  const router = useRouter();

  // Dialog State (from your original code)
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    setEditingRowId(id);
    setEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    console.log("Delete row:", id);
  };

  // --- MRT Columns Configuration ---
  const columns = useMemo<MRT_ColumnDef<Data>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ល.រ នធម",
        // size: 100, // equivalent to specific width/padding
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "title",
        header: "ឈ្មោះឯកសារ",
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "left" },
      },
      {
        accessorKey: "status",
        header: "ស្ថានភាព",
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "left" },
      },
      {
        accessorKey: "days",
        header: "ចំនួនថ្ងៃ",
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "right" },
      },
      {
        accessorKey: "types",
        header: "ប្រភេទឯកសារ",
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "left" },
      },
      {
        accessorKey: "categories",
        header: "ឯកសារ",
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "left" },
      },
      {
        accessorKey: "office",
        header: "ការិយាល័យទទួលបន្ទុក",
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "left" },
      },
    ],
    [],
  );

  // --- MRT Hook Initialization ---
  const table = useMaterialReactTable({
    columns,
    data: data, // Pass your API data here

    // Core features matching your original table
    enableRowSelection: true,
    enableGlobalFilter: true, // Enables the search box
    enableRowActions: true,
    positionActionsColumn: "last",

    // UI Styling / Densities
    initialState: {
      density: "compact", // Translates to your dense = true state
      showGlobalFilter: true, // Keep search box open by default
    },

    // Customize the built-in search box to look like your SearchInputWithIcon
    muiSearchTextFieldProps: {
      placeholder: "ស្វែងរកឯកសារតាមរយៈ ល.ន.ធ.ម",
      variant: "outlined",
      size: "small",
      InputProps: {
        startAdornment: (
          <SearchOutlinedIcon
            sx={{ transform: "scaleX(-1)", mr: 1 }}
            color="error"
          />
        ),
      },
    },

    // --- Action Buttons Definition ---
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "ចំណាត់ការឯកសារ", // Custom Header for actions column
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        size: 150,
      },
    },
    renderRowActions: ({ row }) => (
      <Box
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          gap: "4px",
          justifyContent: "center",
        }}
      >
        <Tooltip title="Edit">
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation(); // Ensure row click isn't triggered
              handleEdit(row.original.id);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.original.id);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <RowActionMenu row={row} />
      </Box>
    ),

    // --- Row Click Navigation ---
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        router.push(`/documents/${row.original.id}`);
      },
      sx: {
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
      },
    }),

    // --- Detail Panel / Expandable Row ---
    // This replaces your <Collapse> logic seamlessly
    renderDetailPanel: ({ row }) => {
      const details = row.original.details;
      return (
        <Box sx={{ margin: 2 }}>
          <Typography variant="h6" gutterBottom>
            លម្អិត
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {row.original.description}
          </Typography>
          {details && (
            <TableContainer component={Paper} elevation={1}>
              <Table size="small" sx={{ minWidth: "50vmin" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        <strong>បរិយាយ</strong>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        <strong>ទិន្នន័យ</strong>
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>លេខលិខិតដើម:</strong>
                    </TableCell>
                    <TableCell>{details.originId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>កាលបរិច្ឆេទលិខិតចូល:</strong>
                    </TableCell>
                    <TableCell>{details.acceptedDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>ម៉ោងចូល:</strong>
                    </TableCell>
                    <TableCell>{details.acceptedTime}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>រូបភាពឯកសារ:</strong>
                    </TableCell>
                    <TableCell>
                      <Link href={details.originDoc} target="_blank">
                        រូបភាពឯកសារដើម
                      </Link>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>អ្នកទទួលឯកសារ:</strong>
                    </TableCell>
                    <TableCell>{details.recieptant}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>កំពុងប្រតិបត្តិការនៅ:</strong>
                    </TableCell>
                    <TableCell>{details.currentProcessor}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>អ្នកបញ្ជូនឯកសារ:</strong>
                    </TableCell>
                    <TableCell>{details.recievedBy}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>អ្នកទទួលឯកសារពីខុទ្ទកាល័យ:</strong>
                    </TableCell>
                    <TableCell>{details.retreivedDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>អ្នកប្រថាប់ត្រា:</strong>
                    </TableCell>
                    <TableCell>{details.stampedBy}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>កាលបរិច្ឆេទប្រថាប់ត្រា:</strong>
                    </TableCell>
                    <TableCell>{details.stampedDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>លេខលិខិតចេញ:</strong>
                    </TableCell>
                    <TableCell>{details.issuanceNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>កាលបរិច្ឆេទបញ្ជូនចេញ:</strong>
                    </TableCell>
                    <TableCell>{details.issuanceDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>អ្នកទទួលឯកសារចេញ:</strong>
                    </TableCell>
                    <TableCell>{details.lastRecipient}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>រូបភាពឯកសារបញ្ចប់:</strong>
                    </TableCell>
                    <TableCell>
                      <Link href={details.finishedDoc} target="_blank">
                        រូបភាពឯកសារបញ្ចប់
                      </Link>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>លេខទូរ:</strong>
                    </TableCell>
                    <TableCell>{details.shelveNo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>លេខក្រូណូ:</strong>
                    </TableCell>
                    <TableCell>{details.archiveNo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>លេខរៀងឯកសារ:</strong>
                    </TableCell>
                    <TableCell>{details.docSequence}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      );
    },
  });

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <MaterialReactTable table={table} />

      {/* Put your dialog logic back here */}
      {/* <DocumentFormDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        initialData={editingRowId}
      /> */}
    </Box>
  );
}
