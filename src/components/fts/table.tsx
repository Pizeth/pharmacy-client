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

interface Data {
  id: number;
  status: string;
  types: string;
  days: number;
  name: string;
  office: string;
  description?: string;
  details?: {
    acceptedDate: string;
    acceptedTime: string;
    recieptant: string;
    originId: string;
    originDoc: string;
    finishedDoc: string;
  };
}

function createData(
  id: number,
  name: string,
  status: string,
  days: number,
  types: string,
  office: string,
  description?: string,
  details?: {
    acceptedDate: string;
    acceptedTime: string;
    recieptant: string;
    originId: string;
    originDoc: string;
    finishedDoc: string;
  },
): Data {
  return {
    id,
    name,
    status,
    days,
    types,
    office,
    description,
    details,
  };
}

const rows = [
  createData(1, "Cupcake", 305, 3.7, 67, 4.3, "Sweet dessert", {
    serving: "1 cupcake",
    ingredients: ["Flour", "Sugar", "Butter", "Eggs"],
  }),
  createData(2, "Donut", 452, 25.0, 51, 4.9, "Fried dough", {
    serving: "1 donut",
    ingredients: ["Flour", "Sugar", "Oil", "Yeast"],
  }),
  createData(3, "Eclair", 262, 16.0, 24, 6.0, "French pastry", {
    serving: "1 eclair",
    ingredients: ["Pastry", "Cream", "Chocolate"],
  }),
  createData(4, "Frozen yoghurt", 159, 6.0, 24, 4.0, "Cold treat", {
    serving: "100g",
    ingredients: ["Yogurt", "Sugar", "Fruit"],
  }),
  createData(5, "Gingerbread", 356, 16.0, 49, 3.9, "Spiced cookie", {
    serving: "1 cookie",
    ingredients: ["Flour", "Ginger", "Molasses"],
  }),
  createData(6, "Honeycomb", 408, 3.2, 87, 6.5, "Toffee candy", {
    serving: "50g",
    ingredients: ["Sugar", "Honey", "Baking soda"],
  }),
  createData(7, "Ice cream sandwich", 237, 9.0, 37, 4.3, "Frozen dessert", {
    serving: "1 sandwich",
    ingredients: ["Ice cream", "Cookies"],
  }),
  createData(8, "Jelly Bean", 375, 0.0, 94, 0.0, "Chewy candy", {
    serving: "10 beans",
    ingredients: ["Sugar", "Corn syrup", "Gelatin"],
  }),
  createData(9, "KitKat", 518, 26.0, 65, 7.0, "Chocolate wafer", {
    serving: "1 bar",
    ingredients: ["Chocolate", "Wafer", "Sugar"],
  }),
  createData(10, "Lollipop", 392, 0.2, 98, 0.0, "Hard candy", {
    serving: "1 lollipop",
    ingredients: ["Sugar", "Corn syrup", "Flavoring"],
  }),
  createData(11, "Marshmallow", 318, 0, 81, 2.0, "Soft candy", {
    serving: "4 pieces",
    ingredients: ["Sugar", "Gelatin", "Corn syrup"],
  }),
  createData(12, "Nougat", 360, 19.0, 9, 37.0, "Chewy confection", {
    serving: "50g",
    ingredients: ["Sugar", "Honey", "Nuts", "Egg whites"],
  }),
  createData(13, "Oreo", 437, 18.0, 63, 4.0, "Sandwich cookie", {
    serving: "3 cookies",
    ingredients: ["Flour", "Sugar", "Cocoa", "Cream"],
  }),
];

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
    id: "name",
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
    numeric: true,
    disablePadding: false,
    label: "ប្រភេទឯកសារ",
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
            color="primary"
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
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ bgcolor: "background.paper" }}
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
        <TableCell align="right" sx={{ bgcolor: "background.paper" }}>
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
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            checked={isItemSelected}
            onClick={(event) => handleClick(event, row.id)}
            inputProps={{
              "aria-labelledby": labelId,
            }}
          />
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none">
          {row.id}
        </TableCell>
        <TableCell align="right">{row.name}</TableCell>
        <TableCell align="right">{row.status}</TableCell>
        <TableCell align="right">{row.days}</TableCell>
        <TableCell align="right">{row.types}</TableCell>
        <TableCell align="right">{row.office}</TableCell>
        <TableCell align="right">
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row.id);
              }}
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
                Details
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {row.description}
              </Typography>
              {row.details && (
                <Box>
                  <Typography variant="body2">
                    <strong>Serving:</strong> {row.details.serving}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Ingredients:</strong>{" "}
                    {row.details.ingredients.join(", ")}
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
        label="Dense padding"
      />
    </Box>
  );
}
