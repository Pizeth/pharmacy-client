import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Collapse from "@mui/material/Collapse";
import { visuallyHidden } from "@mui/utils";
import { Link } from "@mui/material";

interface Data {
  id: number;
  title: string;
  status: string;
  days: number;
  types: string;
  categories: string;
  office: string;
  // permissionTypes?: string;
  description?: string;
  details?: {
    originId?: string;
    acceptedDate: string;
    acceptedTime: string;
    originDoc?: string;
    recieptant: string;
    currentProcessor: string;
    deliverBy: string;
    recievedBy: string;
    retrievedBy: string;
    retreivedDate: string;
    stampedBy?: string;
    stampedDate?: string;
    issuanceNumber?: string;
    issuanceDate?: string;
    lastRecipient: string;
    finishedDoc?: string;
    shelveNo?: string;
    archiveNo?: string;
    docSequence?: string;
  };
}

function createData(
  id: number,
  title: string,
  status: string,
  days: number,
  types: string,
  categories: string,
  office: string,
  // permissionTypes?: string,
  description?: string,
  details?: {
    originId?: string;
    acceptedDate: string;
    acceptedTime: string;
    originDoc?: string;
    recieptant: string;
    currentProcessor: string;
    deliverBy: string;
    recievedBy: string;
    retrievedBy: string;
    retreivedDate: string;
    stampedBy?: string;
    stampedDate?: string;
    issuanceNumber?: string;
    issuanceDate?: string;
    lastRecipient: string;
    finishedDoc?: string;
    shelveNo?: string;
    archiveNo?: string;
    docSequence?: string;
  },
): Data {
  return {
    id,
    title,
    status,
    days,
    types,
    categories,
    office,
    description,
    details,
  };
}

// const rows = [
//   createData(
//     1,
//     "ប្រកាសស្ដីពីការដាក់លោក ក ឱ្យស្ថិតក្នុងភាពទំេរគ្មានបៀវត្ស",
//     "កំពុងដំណើការ",
//     5,
//     "ឯកសាមុខការ",
//     "ទំនេរគ្មានបៀវត្ស",
//     "ការិយាល័យក្របខណ្ឌនិងបៀវត្ស",
//     "ឯកសារបានដាក់ជូនបងខេង( 1/27/2026) -ឯកសារបានដាក់ជូនបងវីរៈ1/12/2026",
//     {
//       originId: "",
//       acceptedDate: "20-Jan-2026",
//       acceptedTime: "2:00PM",
//       originDoc:
//         "https://drive.google.com/open?id=1T2LGZ8RQ3_Dz5GRX935lJWKTX2oJ0B9A",
//       recieptant: "ម៉ាលី",
//       currentProcessor: "រដ្ឋលេខាធិការ",
//       deliverBy: "ធារ៉ូត",
//       recievedBy: "វិរៈ",
//       retrievedBy: "",
//       retreivedDate: "",
//       stampedBy: "",
//       stampedDate: "",
//       issuanceNumber: "",
//       issuanceDate: "",
//       lastRecipient: "",
//       finishedDoc: "",
//       shelveNo: "",
//       archiveNo: "",
//       docSequence: "",
//     },
//   ),
// ];

// Helper arrays for random data generation
const titles = [
  "ប្រកាសស្ដីពីការដាក់លោក ក ឱ្យស្ថិតក្នុងភាពទំេរគ្មានបៀវត្ស",
  "សំណើសុំដំឡើងកាំប្រាក់ជូនមន្ត្រីរាជការ",
  "របាយការណ៍បូកសរុបការងារប្រចាំខែ",
  "លិខិតអញ្ជើញចូលរួមកិច្ចប្រជុំបូកសរុបការងារ",
  "សេចក្តីសម្រេចស្តីពីការបង្កើតគណៈកម្មការ",
  "សំណើទិញសម្ភារៈការិយាល័យសម្រាប់ឆ្នាំ២០២៦",
  "លិខិតសុំច្បាប់ឈប់សម្រាកប្រចាំឆ្នាំ",
  "ដីកាបញ្ជូនឯកសារទៅនាយកដ្ឋានពាក់ព័ន្ធ",
  "កិច្ចសន្យាជួលរថយន្តសម្រាប់ចុះបំពេញបេសកកម្ម",
  "សេចក្តីជូនដំណឹងស្តីពីការរៀបចំពិធីបុណ្យចូលឆ្នាំខ្មែរ",
];

const statuses = [
  "កំពុងដំណើរការ",
  "បានបញ្ចប់",
  "រង់ចាំហត្ថលេខា",
  "ត្រួតពិនិត្យ",
  "បានបដិសេធ",
];
const docTypes = [
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
  "ការិយាល័យក្របខណ្ឌនិងបៀវត្ស",
  "ការិយាល័យរដ្ឋបាលនិងហិរញ្ញវត្ថុ",
  "ការិយាល័យផែនការនិងស្ថិតិ",
  "ការិយាល័យបណ្តុះបណ្តាល",
  "ការិយាល័យសហប្រតិបត្តិការអន្តរជាតិ",
];
const names = [
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
const positions = [
  "រដ្ឋលេខាធិការ",
  "អនុរដ្ឋលេខាធិការ",
  "អគ្គនាយក",
  "ប្រធាននាយកដ្ឋាន",
  "ប្រធានការិយាល័យ",
];

// Generator function
const generateRows = (count: number): Data[] => {
  const data: Data[] = [];

  for (let i = 1; i <= count; i++) {
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomType = docTypes[Math.floor(Math.random() * docTypes.length)];
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    const randomOffice = offices[Math.floor(Math.random() * offices.length)];
    const randomName1 = names[Math.floor(Math.random() * names.length)];
    const randomName2 = names[Math.floor(Math.random() * names.length)];
    const randomName3 = names[Math.floor(Math.random() * names.length)];
    const randomPos = positions[Math.floor(Math.random() * positions.length)];
    const day = Math.floor(Math.random() * 28) + 1;
    const month = Math.floor(Math.random() * 12) + 1;
    const dateStr = `${day}/${month}/2026`;

    data.push(
      createData(
        i,
        randomTitle,
        randomStatus,
        Math.floor(Math.random() * 15) + 1, // 1-15 days
        randomType,
        randomCat,
        randomOffice,
        `ឯកសារបានដាក់ជូនបង${randomName1} (${dateStr})`,
        {
          originId: `DOC-${2026000 + i}`,
          acceptedDate: `${day}-Jan-2026`,
          acceptedTime: `${Math.floor(Math.random() * 12) + 7}:00 ${Math.random() > 0.5 ? "AM" : "PM"}`,
          originDoc:
            Math.random() > 0.3 ? "https://drive.google.com/..." : undefined,
          recieptant: randomName1,
          currentProcessor: randomPos,
          deliverBy: randomName2,
          recievedBy: randomName3,
          retrievedBy: Math.random() > 0.7 ? randomName2 : "",
          retreivedDate: Math.random() > 0.7 ? dateStr : "",
          stampedBy: Math.random() > 0.5 ? randomName1 : undefined,
          stampedDate: Math.random() > 0.5 ? dateStr : undefined,
          issuanceNumber: Math.random() > 0.5 ? `No.${100 + i}/26` : undefined,
          issuanceDate: Math.random() > 0.5 ? dateStr : undefined,
          lastRecipient: randomName3,
          finishedDoc:
            Math.random() > 0.8 ? "https://drive.google.com/..." : undefined,
          shelveNo: `S-${Math.floor(Math.random() * 10)}`,
          archiveNo: `A-${Math.floor(Math.random() * 100)}`,
          docSequence: `${i.toString().padStart(4, "0")}`,
        },
      ),
    );
  }
  return data;
};

const rows = generateRows(100);

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof Data>(
  order: Order,
  orderBy: Key,
): (a: Data, b: Data) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "ល.រ នធម",
  },
  {
    id: "title",
    numeric: false,
    disablePadding: true,
    label: "ឈ្មោះឯកសារ",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "ស្ថានភាព",
  },
  {
    id: "days",
    numeric: true,
    disablePadding: false,
    label: "ចំនួនថ្ងៃ",
  },
  {
    id: "types",
    numeric: false,
    disablePadding: false,
    label: "ប្រភេទឯកសារ",
  },
  {
    id: "categories",
    numeric: false,
    disablePadding: false,
    label: "ឯកសារ",
  },
  {
    id: "office",
    numeric: false,
    disablePadding: false,
    label: "ការិយាល័យទទួលបន្ទុក",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" sx={{ bgcolor: "background.paper" }} />
        <TableCell padding="checkbox" sx={{ bgcolor: "background.paper" }}>
          <Checkbox
            color="error"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            // align={headCell.numeric ? "right" : "left"}
            align={"center"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              bgcolor: "background.paper",
              h6: {
                fontFamily: "var(--font-interkhmerloopless)",
                fontWeight: 700,
              },
            }}
            // variant="head"
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              <Typography variant="h6">{headCell.label}</Typography>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell
          align="center"
          sx={{
            bgcolor: "background.paper",
            h6: {
              fontFamily: "var(--font-interkhmerloopless)",
              fontWeight: 700,
            },
          }}
        >
          <Typography variant="h6">ចំណាត់ការឯកសារ</Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="h6"
          component="div"
        >
          បញ្ជីឯកសារ {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          បញ្ជីឯកសារ
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

interface RowProps {
  row: Data;
  isItemSelected: boolean;
  labelId: string;
  handleClick: (event: React.MouseEvent<unknown>, id: number) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
  handleMore: (id: number) => void;
  dense: boolean;
}

function Row(props: RowProps) {
  const {
    row,
    isItemSelected,
    labelId,
    handleClick,
    handleEdit,
    handleDelete,
    handleMore,
    dense,
  } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
      >
        <TableCell align="center">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell padding="checkbox" align="center">
          <Checkbox
            color="error"
            checked={isItemSelected}
            onClick={(event) => handleClick(event, row.id)}
            inputProps={{
              "aria-labelledby": labelId,
            }}
          />
        </TableCell>
        <TableCell
          component="th"
          id={labelId}
          scope="row"
          padding="none"
          align="center"
        >
          {row.id}
        </TableCell>
        <TableCell align="left">{row.title}</TableCell>
        <TableCell align="left" padding="none">
          {row.status}
        </TableCell>
        <TableCell align="center" padding="none">
          {row.days}
        </TableCell>
        <TableCell align="left" padding="none">
          {row.types}
        </TableCell>
        <TableCell align="left" padding="none">
          {row.categories}
        </TableCell>
        <TableCell align="left" padding="none">
          {row.office}
        </TableCell>
        <TableCell align="center" padding="none">
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row.id);
              }}
              color="error"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row.id);
              }}
              color="primary"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="More">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleMore(row.id);
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                លម្អិត
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {row.description}
              </Typography>
              {row.details && (
                <Box>
                  <Typography variant="body2">
                    <strong>លេខលិខិតដើម: </strong> {row.details.originId}
                  </Typography>
                  <Typography variant="body2">
                    <strong>កាលបរិច្ឆេទលិខិតចូល: </strong>
                    {row.details.acceptedDate}
                  </Typography>
                  <Typography variant="body2">
                    <strong>ម៉ោងចូល: </strong> {row.details.acceptedTime}
                  </Typography>
                  <Typography variant="body2">
                    <strong>រូបភាពឯកសារ: </strong>{" "}
                    <Link href={row.details.originDoc} target="_blank">
                      រូបភាពឯកសារដើម
                    </Link>
                  </Typography>
                  <Typography variant="body2">
                    <strong>អ្នកទទួលឯកសារ: </strong> {row.details.recieptant}
                  </Typography>
                  <Typography variant="body2">
                    <strong>កំពុងប្រតិបត្តិការនៅ: </strong>
                    {row.details.currentProcessor}
                  </Typography>
                  <Typography variant="body2">
                    <strong>អ្នកបញ្ជូនឯកសារ: </strong> {row.details.deliverBy}
                  </Typography>
                  <Typography variant="body2">
                    <strong>អ្នកទទួលឯកសារបន្ត: </strong>
                    {row.details.recievedBy}
                  </Typography>
                  <Typography variant="body2">
                    <strong>អ្នកទទួលឯកសារពីខុទ្ទកាល័យ: </strong>
                    {row.details.retrievedBy}
                  </Typography>
                  <Typography variant="body2">
                    <strong>កាលបរិច្ឆេទទទួលឯកសារពីខុទ្ទកាល័យ: </strong>
                    {row.details.retreivedDate}
                  </Typography>
                  <Typography variant="body2">
                    <strong>អ្នកប្រថាប់ត្រា: </strong> {row.details.stampedBy}
                  </Typography>
                  <Typography variant="body2">
                    <strong>កាលបរិច្ឆេទប្រថាប់ត្រា: </strong>
                    {row.details.stampedDate}
                  </Typography>
                  <Typography variant="body2">
                    <strong>លេខលិខិតចេញ: </strong> {row.details.issuanceNumber}
                  </Typography>
                  <Typography variant="body2">
                    <strong>កាលបរិច្ឆេទបញ្ជូនចេញ: </strong>
                    {row.details.issuanceDate}
                  </Typography>
                  <Typography variant="body2">
                    <strong>អ្នកទទួលឯកសារចេញ:</strong>
                    {row.details.lastRecipient}
                  </Typography>
                  <Typography variant="body2">
                    <strong>រូបភាពឯកសារបញ្ចប់: </strong>
                    <Link href={row.details.finishedDoc} target="_blank">
                      រូបភាពឯកសារដើម
                    </Link>
                  </Typography>
                  <Typography variant="body2">
                    <strong>លេខទូរ: </strong> {row.details.shelveNo}
                  </Typography>
                  <Typography variant="body2">
                    <strong>លេខក្រូណូ: </strong> {row.details.archiveNo}
                  </Typography>
                  <Typography variant="body2">
                    <strong>លេខរៀងឯកសារ: </strong> {row.details.docSequence}
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function EnhancedTable() {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("status");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const handleEdit = (id: number) => {
    console.log("Edit row:", id);
    // Add your edit logic here
  };

  const handleDelete = (id: number) => {
    console.log("Delete row:", id);
    // Add your delete logic here
  };

  const handleMore = (id: number) => {
    console.log("More actions for row:", id);
    // Add your more actions logic here
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage],
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }} square variant="outlined">
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table
            stickyHeader
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <Row
                    key={row.id}
                    row={row}
                    isItemSelected={isItemSelected}
                    labelId={labelId}
                    handleClick={handleClick}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    handleMore={handleMore}
                    dense={dense}
                  />
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="បង្រួមគម្លាតតារាង"
      />
    </Box>
  );
}
