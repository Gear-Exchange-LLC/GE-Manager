import React from "react";
import ReactDOM from "react-dom";
import styled, { createGlobalStyle } from "styled-components";
import { useForm, useField, splitFormProps } from "react-form";
import { useTable } from "react-table";
import { Button, Box, Checkbox, TextField, InputAdornment, TableHead, TableBody, TableRow, TableCell, Select, MenuItem } from "@mui/material";
import { useEffect } from "react";

const TableInput = props => {
  const { column, row, cell, updateData } = props;
  const onChange = e => updateData(row.index, column.id, e.target.value);
  return <TextField sx={{ width: "100%" }} size="small" value={cell.value} label={column.Header} onChange={onChange} />;
};

const TableCondition = props => {
  const { column, row, cell, updateData } = props;
  const onChange = e => updateData(row.index, column.id, e.target.value);
  return (
    <Select
      labelId="condition"
      id="condition-picker"
      value={cell.value}
      sx={{ width: "100%" }}
      size="small" 
      label={column.Header}
      onChange={onChange}
    >
      <MenuItem value={"pick-one"}>Pick One</MenuItem>
      <MenuItem value={"7c3f45de-2ae0-4c81-8400-fdb6b1d74890"}>Brand New</MenuItem>
      <MenuItem value={"ac5b9c1e-dc78-466d-b0b3-7cf712967a48"}>Mint</MenuItem>
      <MenuItem value={"df268ad1-c462-4ba6-b6db-e007e23922ea"}>Excellent</MenuItem>
      <MenuItem value={"ae4d9114-1bd7-4ec5-a4ba-6653af5ac84d"}>Very Good</MenuItem>
      <MenuItem value={"f7a3f48c-972a-44c6-b01a-0cd27488d3f6"}>Good</MenuItem>
      <MenuItem value={"98777886-76d0-44c8-865e-bb40e669e934"}>Fair</MenuItem>
      <MenuItem value={"fbf35668-96a0-4baa-bcde-ab18d6b1b329"}>Non Functioning</MenuItem>
    </Select>
  );
};

const TableCategory = props => {
  const { column, row, cell, updateData } = props;
  const onChange = e => updateData(row.index, column.id, e.target.value);
  return (
    <Select
      labelId="category"
      id="category-picker"
      value={cell.value}
      sx={{ width: "100%" }}
      size="small" 
      label={column.Header}
      onChange={onChange}
    >
      <MenuItem value={"pick-one"}>Pick One</MenuItem>
      <MenuItem value={"62835d2e-ac92-41fc-9b8d-4aba8c1c25d5"}>Accessories</MenuItem>
      <MenuItem value={"3ca3eb03-7eac-477d-b253-15ce603d2550"}>Acoustic Guitars</MenuItem>
      <MenuItem value={"09055aa7-ed49-459d-9452-aa959f288dc2"}>Amps</MenuItem>
      <MenuItem value={"032c74d0-b0e2-4442-877f-e1a22438a7fa"}>Band and Orchestra</MenuItem>
      <MenuItem value={"53a9c7d7-d73d-4e7f-905c-553503e50a90"}>Bass Guitars</MenuItem>
      <MenuItem value={"58d889f7-0aa1-4689-a9d3-da16dd225e8d"}>DJ And Lighting Gear</MenuItem>
      <MenuItem value={"b3cb9f8e-4cb6-4325-8215-1efcd9999daf"}>Drums and Percussion</MenuItem>
      <MenuItem value={"fa10f97c-dd98-4a8f-933b-8cb55eb653dd"}>Effects and Pedals</MenuItem>
      <MenuItem value={"dfd39027-d134-4353-b9e4-57dc6be791b9"}>Electric Guitars</MenuItem>
      <MenuItem value={"fb60628c-be4b-4be2-9c0f-bc5d31e3996c"}>Folk Instruments</MenuItem>
      <MenuItem value={"40e8bfd0-3021-43f7-b104-9d7b19af5c2b"}>Home Audio</MenuItem>
      <MenuItem value={"d002db05-ab63-4c79-999c-d49bbe8d7739"}>Keyboards and Synths</MenuItem>
      <MenuItem value={"1f99c852-9d20-4fd3-a903-91da9c805a5e"}>Parts</MenuItem>
      <MenuItem value={"b021203f-1ed8-476c-a8fc-32d4e3b0ef9e"}>Pro Audio</MenuItem>
    </Select>
  );
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
const EditTable = React.memo(props => {
  const { setItems, tableInitialData } = props;
  const columns = React.useMemo(
    () => [
      // {
      //   Header: "SKU",
      //   accessor: "sku",
      //   Cell: TableInput
      // },
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
        Header: "Condition",
        accessor: "condition",
        Cell: TableCondition
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: TableCategory
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
      condition: "pick-one",
      category: "pick-one",
      stock: 1,
      listPrice: "",
      purchaseAmount: "",
    },
  ];
  
  const [data, setData] = React.useState(tableInitialData);

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
  console.log(data)
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

export default EditTable;