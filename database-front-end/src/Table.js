import React from "react";
import ReactDOM from "react-dom";
import styled, { createGlobalStyle } from "styled-components";
import { useForm, useField, splitFormProps } from "react-form";
import { useTable } from "react-table";
import { Button, Box, Checkbox, TextField, InputAdornment, TableHead, TableBody, TableRow, TableCell } from "@mui/material";

const TableInput = props => {
  const { column, row, cell, updateData } = props;
  const onChange = e => updateData(row.index, column.id, e.target.value);
  return <TextField sx={{ width: "100%" }} size="small" value={cell.value} label={column.Header} onChange={onChange} />;
};

const TableNum = props => {
  const { column, row, cell, updateData } = props;
  const onChange = e => updateData(row.index, column.id, e.target.value);
  return <TextField type="number" sx={{ width: "100%" }} size="small" value={cell.value} label={column.Header} onChange={onChange} />;
};

const TablePrice = props => {
  const { column, row, cell, updateData } = props;
  const onChange = e => updateData(row.index, column.id, e.target.value);
  return <TextField sx={{ width: "100%" }} size="small" label={column.Header} startAdornment={<InputAdornment position="start">$</InputAdornment>} value={cell.value} onChange={onChange} />;
};

const TableCheck = props => {
  const { column, row, cell, updateData } = props;

  if (cell.value == "true") {
    cell.value = true;
  } else {
    cell.value = false
  }
  const onCheck = e => updateData(row.index, column.id, e.target.checked);

  if (props.value) {
    return <Checkbox value={props.value} onChange={onCheck} />;
  } else {
    return <Checkbox value={props.value} onChange={onCheck} />;
  }

}

const StyledTable = styled.table`
  width: 100%;
  display: block;
  max-width: 100vw;
  border-collapse: collapse;
  background-color: white;
  th,
  td {
    width: 10%;
    text-align: left;
    border: 1px solid lightgray;
    padding: 5px;
  }
`;
const ReactTable = React.memo(props => {
  const { setItems } = props;
  const columns = React.useMemo(
    () => [
      {
        Header: "SKU",
        accessor: "sku",
        Cell: TableInput
      },
      {
        Header: "Make",
        accessor: "make",
        Cell: TableInput
      },
      {
        Header: "Model",
        accessor: "model",
        Cell: TableInput
      },
      {
        Header: "w/Included",
        accessor: "included",
        Cell: TableInput
      },
      {
        Header: "Stock",
        accessor: "stock",
        Cell: TableNum
      },
      {
        Header: "List Price",
        accessor: "listPrice",
        Cell: TablePrice
      },
      {
        Header: "Purchase Amount",
        accessor: "purchaseAmount",
        Cell: TableInput
      },
    ],
    []
  );
  const initialData = [
    {
      sku: "",
      make: "",
      model: "",
      included: "",
      stock: 1,
      listPrice: "",
      purchaseAmount: "",
    },
  ];
  const [data, setData] = React.useState(initialData);
  const resetData = () => setData(initialData);
  const addRow = () => setData(old => [...old, { make: "", model: "", included: "", stock: 1, listPrice: "", purchaseAmount: "" }]);
  const removeRow = () => setData(data.slice(0,-1));
  const updateData = (rowIndex, columnID, value) => {
    console.log(value)
    setData(oldData =>
      oldData.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...oldData[rowIndex],
            [columnID]: value
          };
        }
        return row;
      })
    );
  };
  const table = useTable({ columns, data, updateData });
  const { getTableProps, headerGroups, rows, prepareRow } = table;
  const tableSum = rows.reduce((sum, row) => sum + row.values.total, 0);
  setItems(data)
  return (
    <Box sx={{
      // overflowX: "scroll",
    }}>
      <br />
      <StyledTable {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell {...column.getHeaderProps()}>{column.render("Header")}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {rows.map(row => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <TableCell {...cell.getCellProps()}>{cell.render("Cell")}</TableCell>
                ))}
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell colSpan={12}>
              <Button variant="outlined" sx={{marginRight: 2}} onClick={addRow}>
                Add Row
              </Button>
              <Button variant="outlined" sx={{marginRight: 2}} onClick={removeRow}>
                Remove Row
              </Button>
              <Button variant="outlined" sx={{marginRight: 2}} onClick={resetData}>
                Reset Table
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </StyledTable>
    </Box>
  );
});

export default ReactTable;