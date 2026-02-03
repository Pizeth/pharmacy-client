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
import {
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import generateRows, { Data } from "./mockData";
import { Article, AssignmentTurnedIn, Print } from "@mui/icons-material";

const rows = generateRows(200);

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
            <DeleteIcon color="primary" />
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
  handleMore: (id: number, event: React.MouseEvent<HTMLElement>) => void;
  handleClose: (event: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  open: boolean;
  // handleMore: MouseEventHandler<T> | undefined;
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
    handleClose,
    anchorEl,
    open,
    dense,
  } = props;
  const [exspanded, setExspanded] = React.useState(false);

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
            onClick={() => setExspanded(!exspanded)}
          >
            {exspanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
              disabled={!isItemSelected}
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
              disabled={!isItemSelected}
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
                handleMore(row.id, e);
              }}
              disabled={!isItemSelected}
              aria-controls={open ? "more-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="more-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  // filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  // "&::before": {
                  //   content: '""',
                  //   display: "block",
                  //   position: "absolute",
                  //   top: 0,
                  //   right: 14,
                  //   width: 10,
                  //   height: 10,
                  //   bgcolor: "background.paper",
                  //   transform: "translateY(-50%) rotate(45deg)",
                  //   zIndex: 0,
                  // },
                },
              },
              list: { dense: dense },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* <MenuItem onClick={handleClose}>
              <Avatar /> Profile
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Avatar /> My account
            </MenuItem>
            <Divider /> */}
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Print fontSize="small" color="warning" />
              </ListItemIcon>
              <ListItemText>បោះពុម្ភ</ListItemText>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                ⌘V
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Article fontSize="small" color="secondary" />
              </ListItemIcon>
              <ListItemText>មើលលម្អិត</ListItemText>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                ⌘V
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <AssignmentTurnedIn fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>បញ្ចប់ប្រតិបត្តិការ</ListItemText>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                ⌘V
              </Typography>
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={exspanded} timeout="auto" unmountOnExit>
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
                    <strong>រូបភាពឯកសារ: </strong>
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
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

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

  const [anchorElAction, setAnchorElAction] =
    React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorElAction);

  const handleMore = (id: number, event: React.MouseEvent<HTMLElement>) => {
    console.log("More actions for row:", id);
    console.log(event.currentTarget);
    setAnchorElAction(event.currentTarget);
    // Add your more actions logic here
  };

  const handleClose = () => {
    setAnchorElAction(null);
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
        <TableContainer sx={{ maxHeight: "70vmin" }}>
          <Table
            stickyHeader
            sx={{ minWidth: "90vmin" }}
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
                    handleClose={handleClose}
                    anchorEl={anchorElAction}
                    open={open}
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
          rowsPerPageOptions={[
            5,
            10,
            15,
            25,
            50,
            100,
            { label: "All", value: -1 },
          ]}
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
