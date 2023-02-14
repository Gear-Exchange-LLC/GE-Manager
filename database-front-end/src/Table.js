import * as React from 'react';
import PropTypes from 'prop-types';
import Select from '@mui/material/Select';
import { DataGrid, useGridApiContext, useGridApiRef } from '@mui/x-data-grid';
import { Button, TextField } from '@mui/material';

var rows = [
  {
    id: 1,
    name: 'Olivier',
    role: 'Back-end Developer',
  },
  {
    id: 2,
    name: 'Danail',
    role: 'UX Designer',
  },
  {
    id: 3,
    name: 'Matheus',
    role: 'Front-end Developer',
  },
];

function SelectEditInputCell(props) {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = async (event) => {
    await apiRef.current.setEditCellValue({ id, field, value: event.target.value });
    // apiRef.current.stopCellEditMode({ id, field });

    rows.map((row) => {
      if (row.id == id) {
        row.role = value;
      }
    })
  };

  return (
    <TextField
      value={value}
      onChange={handleChange}
      size="small"
      sx={{height: 1}}
      autoFocus
    />
    // <Select
    //   value={value}
    //   onChange={handleChange}
    //   size="small"
    //   sx={{ height: 1 }}
    //   native
    //   autoFocus
    // >
    //   <option>Back-end Developer</option>
    //   <option>Front-end Developer</option>
    //   <option>UX Designer</option>
    // </Select>
  );
}

SelectEditInputCell.propTypes = {
  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: PropTypes.any,
};

const renderSelectEditInputCell = (params) => {
  return <SelectEditInputCell {...params} />;
};

export default function AutoStopEditComponent() {
  
  const apiRef2 = useGridApiRef();

  const [rows, setRows] = React.useState([
    {
      id: 1,
      name: 'Olivier',
      role: 'Back-end Developer',
    },
    {
      id: 2,
      name: 'Danail',
      role: 'UX Designer',
    },
    {
      id: 3,
      name: 'Matheus',
      role: 'Front-end Developer',
    },
  ]);

  const addRow = async () => {
    var newVal = {
      id: rows.length + 1,
      name: '',
      role: '',
    }

    apiRef2.current.updateRows([newVal])
  }



  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        experimentalFeatures={{ newEditingApi: true }}
        apiRef={apiRef2}
      />
      <Button variant='contained' onClick={() => addRow()}>Add Row</Button>
      <Button variant='contained' onClick={() => console.log(rows)}>Test</Button>
    </div>
  );
}

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    width: 120,
  },
  {
    field: 'role',
    headerName: 'Role',
    renderEditCell: renderSelectEditInputCell,
    editable: true,
    width: 180,
  },
];