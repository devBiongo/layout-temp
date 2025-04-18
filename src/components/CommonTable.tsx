import {
  Box,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { ChangeEvent, MouseEvent, ReactNode, useMemo, useState } from "react";

type Order = "asc" | "desc";

export interface Column<T> {
  id: keyof T;
  label: string;
  numeric?: boolean;
  disablePadding?: boolean;
  render?: (row: T) => ReactNode;
}

interface CommonTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  rowKey: keyof T;
  defaultOrderBy?: keyof T;
  defaultOrder?: Order;
  rowsPerPageOptions?: number[];
  checkboxSelection?: boolean;
  onSelectionChange?: (selected: T[]) => void;
}

function getComparator<T>(
  order: Order,
  orderBy: keyof T
): (a: T, b: T) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
  const valA = a[orderBy];
  const valB = b[orderBy];

  if (valB < valA) return -1;
  if (valB > valA) return 1;
  return 0;
}

export function CommonTable<T>({
  rows,
  columns,
  rowKey,
  defaultOrderBy,
  defaultOrder = "asc",
  rowsPerPageOptions = [5, 10, 25],
  checkboxSelection = false,
  onSelectionChange,
}: CommonTableProps<T>) {
  const [order, setOrder] = useState<Order>(defaultOrder);
  const [orderBy, setOrderBy] = useState<keyof T>(
    defaultOrderBy ?? columns[0].id
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const visibleRows = useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
  );

  const handleRequestSort = (_: MouseEvent<unknown>, property: keyof T) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: string) => selected.has(id);

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = new Set(visibleRows.map((n) => String(n[rowKey])));
      setSelected(newSelected);
      onSelectionChange?.(
        rows.filter((r) => newSelected.has(String(r[rowKey])))
      );
      return;
    }
    setSelected(new Set());
    onSelectionChange?.([]);
  };

  const handleClick = (_: MouseEvent<unknown>, id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }

    setSelected(newSelected);
    onSelectionChange?.(rows.filter((r) => newSelected.has(String(r[rowKey]))));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {checkboxSelection && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selected.size > 0 && selected.size < visibleRows.length
                      }
                      checked={
                        visibleRows.length > 0 &&
                        visibleRows.every((row) =>
                          selected.has(String(row[rowKey]))
                        )
                      }
                      onChange={handleSelectAllClick}
                      inputProps={{ "aria-label": "select all rows" }}
                    />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell
                    key={String(col.id)}
                    align={col.numeric ? "right" : "left"}
                    padding={col.disablePadding ? "none" : "normal"}
                    sortDirection={orderBy === col.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : "asc"}
                      onClick={(e) => handleRequestSort(e, col.id)}
                    >
                      {col.label}
                      {orderBy === col.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row, rowIndex) => {
                const id = String(row[rowKey]);
                const isItemSelected = isSelected(id);

                return (
                  <TableRow
                    hover
                    onClick={
                      checkboxSelection
                        ? (event) => handleClick(event, id)
                        : undefined
                    }
                    sx={{ cursor: "pointer" }}
                    role={checkboxSelection ? "checkbox" : undefined}
                    aria-checked={
                      checkboxSelection ? isItemSelected : undefined
                    }
                    selected={checkboxSelection ? isItemSelected : undefined}
                    key={id}
                  >
                    {checkboxSelection && (
                      <TableCell padding="checkbox">
                        <Checkbox color="primary" checked={isItemSelected} />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell
                        key={`${rowIndex}-${String(col.id)}`}
                        align={col.numeric ? "right" : "left"}
                        padding={col.disablePadding ? "none" : "normal"}
                      >
                        {col.render ? col.render(row) : String(row[col.id])}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
