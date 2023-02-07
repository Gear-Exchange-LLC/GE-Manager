import React from "react";
import ReactDOM from "react-dom";
import styled, { createGlobalStyle } from "styled-components";
import { useForm, useField, splitFormProps } from "react-form";
import { useTable } from "react-table";

const TableInput = props => {
  const { column, row, cell, updateData } = props;
  const onChange = e => updateData(row.index, column.id, e.target.value);
  return <input type="text" value={cell.value} placeholder={column.Header} onChange={onChange} />;
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
    return <input type="checkbox" value={props.value} onChange={onCheck} checked />;
  } else {
    return <input type="checkbox" value={props.value} onChange={onCheck} />;
  }

}

const StyledTable = styled.table`
  width: 100vw;
  display: block;
  max-width: 100vw;
  border-collapse: collapse;
  background-color: white;
  overflow: scroll;
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
        Cell: TableInput
      },
      {
        Header: "X",
        accessor: "x",
        Cell: TableInput
      },
      {
        Header: "Percent",
        accessor: "percent",
        Cell: TableInput
      },
      {
        Header: "Store Credit Amount",
        accessor: "storeCredit",
        Cell: TableInput
      },
      {
        Header: "Purchase Amount",
        accessor: "purchaseAmount",
        Cell: TableInput
      },
      {
        Header: "SKU",
        accessor: "sku",
        Cell: TableInput
      },
      {
        Header: "Store Credit",
        accessor: "storeCreditCheck",
        Cell: TableCheck
      },
      {
        Header: "Sell",
        accessor: "sellCheck",
        Cell: TableCheck  
      }
    ],
    []
  );
  const initialData = [
    {
      make: "",
      model: "",
      included: "",
      condition: "",
      x: "",
      percent: "",
      storeCredit: "",
      purchaseAmount: "",
      sku: "",
      storeCreditCheck: false,
      sellCheck: false
    },
  ];
  const [data, setData] = React.useState(initialData);
  const resetData = () => setData(initialData);
  const addRow = () => setData(old => [...old, { make: "", model: "", total: true }]);
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
    <>
      <label>Itemized Costs:</label>
      <br />
      <StyledTable {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
          <tr>
            <td colSpan={11}>
              <button type="button" onClick={addRow}>
                Add Row
              </button>
              <button type="button" onClick={removeRow}>
                Remove Row
              </button>
              <button type="button" onClick={resetData}>
                Reset Table
              </button>
            </td>
          </tr>
        </tbody>
      </StyledTable>
    </>
  );
});

export default ReactTable;