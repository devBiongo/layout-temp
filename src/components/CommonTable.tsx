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
  key?: keyof T;
  label: string | (() => ReactNode);
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
  const firstSortableColumn = columns.find(
    (col): col is Column<T> & { id: keyof T } => !!col.key
  );
  const [order, setOrder] = useState<Order>(defaultOrder);
  const [orderBy, setOrderBy] = useState<keyof T>(
    defaultOrderBy ?? (firstSortableColumn?.id as keyof T)
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const sortedRows = useMemo(() => {
    if (!orderBy) return rows;
    return [...rows].sort(getComparator(order, orderBy));
  }, [order, orderBy, rows]);

  const visibleRows = useMemo(
    () =>
      sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedRows, page, rowsPerPage]
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
                      slotProps={{
                        input: {
                          "aria-label": "select all rows",
                        },
                      }}
                    />
                  </TableCell>
                )}
                {columns.map((col, index) => {
                  const sortable = col.key !== undefined;
                  return (
                    <TableCell
                      key={String(col.key ?? index)}
                      align={col.numeric ? "right" : "left"}
                      padding={col.disablePadding ? "none" : "normal"}
                      sortDirection={
                        sortable && orderBy === col.key ? order : false
                      }
                    >
                      {sortable ? (
                        <TableSortLabel
                          active={orderBy === col.key}
                          direction={orderBy === col.key ? order : "asc"}
                          onClick={(e) => handleRequestSort(e, col.key!)}
                        >
                          {typeof col.label === "function"
                            ? col.label()
                            : col.label}
                          {orderBy === col.key ? (
                            <Box component="span" sx={visuallyHidden}>
                              {order === "desc"
                                ? "sorted descending"
                                : "sorted ascending"}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      ) : typeof col.label === "function" ? (
                        col.label()
                      ) : (
                        col.label
                      )}
                    </TableCell>
                  );
                })}
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
                    {columns.map((col, colIndex) => (
                      <TableCell
                        key={`${rowIndex}-${colIndex}`}
                        align={col.numeric ? "right" : "left"}
                        padding={col.disablePadding ? "none" : "normal"}
                      >
                        {col.render
                          ? col.render(row)
                          : col.key
                          ? String(row[col.key])
                          : null}
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
