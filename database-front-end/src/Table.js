import React, { useState } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
 
const Table = (props) => {
  const [rowData, setData] = useState([{make: "Test", model: "Model", price: 213},{make: "Testasjdishdi", model: "Model", price: 213243}]);

  const [columnDefs] = useState([
    { field: 'make', editable: true },
    { field: 'model' },
    { field: 'price' },
  ]);

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
      <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
      <input type="button" onClick={() => {setData(prev => [...prev, {make: ""}]); props.setItems(rowData) }} value="Add" />
    </div>
  );
};

export default Table;
