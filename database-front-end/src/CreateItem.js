import { Box, AppBar, Toolbar, Typography, Button, TextField, Checkbox, FormGroup, FormControlLabel, Snackbar, CircularProgress } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useState, useEffect, useContext, dispatch, useReducer } from "react";
import './App.css';
import { SocketContext } from "./context/SocketContext";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import EditTable from "material-ui-table-edit"

import dayjs from "dayjs"

import { DesktopDatePicker } from "@mui/x-date-pickers";
import ReactTable from "./Table";


function CreateItem() {
  
  const socket = useContext(SocketContext);

  const [date, setDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [FirstName, setFirstName] = React.useState("");
  const [MiddleName, setMiddleName] = React.useState("");
  const [LastName, setLastName] = React.useState("");
  const [DriversLicenseNum, setDriversLicenseNum] = React.useState();
  const [PhoneNumber, setPhoneNumber] = React.useState();
  const [StoreCredit, setStoreCredit] = React.useState(false);
  const [SellCheck, setSellCheck] = React.useState(false);
  const [TransactionID, setTransactionID] = React.useState();
  const [PONum, setPONum] = React.useState();
  const [items, setItems] = React.useState([]);

  const [openSnack, setOpenSnack] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  function createItem() {

    if (FirstName === "" || MiddleName === "" || LastName === "" || items === []) {

      console.log("Please Fill Out")

      setOpenSnack(true);

      return;
    }

    const value = { date: date, timeCreated: new Date().toISOString(), firstName: FirstName, middleName: MiddleName, lastName: LastName, driversLicense: DriversLicenseNum, phoneNumber: PhoneNumber, storeCredit: StoreCredit, sell: SellCheck, transactionID: TransactionID, poNum: PONum, items: items }

    setLoading(true);

    socket.emit("create-item", JSON.stringify(value))
  }

  useEffect(() => {
    socket.on("created", (socket) => {
        window.location.href = "/dashboard"
        setLoading(false);
    })
  })

  const [value, setValue] = React.useState(
    dayjs('2014-08-18T21:11:54'),
  );

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const inputStyle = {
    width: "400px",

  }

  return (
    <Box sx={{
      height: "100vh"
    }}>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              Gear Exchange DB Manager
            </Typography>
            <Button color="secondary" variant="contained" onClick={() => window.location.href = "/dashboard"}>Back to Dashboard</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Box sx={{
        display: "flex",
        flexDirection: "column"
      }}>
        <Box className="InputItem" sx={inputStyle} >
            <DesktopDatePicker
              label="Date"
              inputFormat="mm/dd/yyyy"
              renderInput={(params) => <TextField {...params} />}
              value={value}
              onChange={handleChange}
            />
          </Box>
        <Box className="InputItem">
          <TextField sx={inputStyle} id="firstNameInput" label="First Name" variant="outlined" onChange={(event) => { setFirstName(event.target.value) }} />
        </Box>
        <Box className="InputItem">
          <TextField sx={inputStyle} id="middleNameInput" label="Middle Name" variant="outlined" onChange={(event) => { setMiddleName(event.target.value) }} />
        </Box>
        <Box className="InputItem">
          <TextField sx={inputStyle} id="lastNameInput" label="Last Name" variant="outlined"  onChange={(event) => { setLastName(event.target.value) }} />
        </Box>
        <Box className="InputItem">
          <TextField sx={inputStyle} id="driversLicenseInput" label="Drivers License #" variant="outlined" onChange={(event) => { setDriversLicenseNum(event.target.value) }} />
        </Box>
        <Box className="InputItem">
          <TextField sx={inputStyle} id="phoneNumberInput" label="Phone Number" variant="outlined" onChange={(event) => { setPhoneNumber(event.target.value) }} />
        </Box>
        <FormGroup>
          <FormControlLabel control={<Checkbox onChange={(event) => { if (event.target.value == "on") { setStoreCredit(true) } else { setStoreCredit(false) }}} defaultChecked />} label="Store Credit" />
          <FormControlLabel control={<Checkbox onChange={(event) => { if (event.target.value == "on") { setSellCheck(true) } else { setSellCheck(false) }}} />} label="Sell" />
        </FormGroup>
        <Box className="InputItem">
          <TextField sx={inputStyle} id="transactionIDInput" label="Transaction ID" variant="outlined" onChange={(event) => { setTransactionID(event.target.value) }} />
        </Box>
        <Box className="InputItem">
          <TextField sx={inputStyle} id="poInput" label="PO #" variant="outlined" onChange={(event) => { setPONum(event.target.value) }} />
        </Box>
        <Box sx={{ width: "50vw" }}>
          <ReactTable setItems={setItems} />
        </Box>
        <Button variant="contained" color="primary" disabled={loading} size="large" sx={{width: 200}} onClick={() => createItem()}>
          Submit
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                color: "green",
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Button>
      </Box>
      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Please Fill In All Fields"
        action={action}
      />
    </Box>
  );

  // return (
  //   <div className="App">
  //     <div className="Header">
  //       <h1>Gear Exchange Database</h1>
  //       <a className="Button" href="/">Back to Dashboard</a>
  //     </div>
  //     <div className="InputWrapper">
  //       <div className="InputItem">
  //           <p>Date:</p>
  //           <input type="date" value={`${date}`} onChange={(event) => setDate(event.target.value)}/>
  //         </div>
  //       <div className="InputItem">
  //         <p>First Name:</p>
  //         <input type="text" onChange={(event) => setFirstName(event.target.value)}/>
  //       </div>
  //       <div className="InputItem">
  //         <p>MI:</p>
  //         <input type="text" onChange={(event) => setMiddleName(event.target.value)}/>
  //       </div>
  //       <div className="InputItem">
  //         <p>Last Name:</p>
  //         <input type="text" onChange={(event) => setLastName(event.target.value)}/>
  //       </div>
  //       <div className="InputItem">
  //         <p>Drivers License #:</p>
  //         <input type="text" onChange={(event) => setDriversLicenseNum(event.target.value)}/>
  //       </div>
  //       <div className="InputItem">
  //         <p>Phone Number:</p>
  //         <input type="number" onChange={(event) => setPhoneNumber(event.target.value)}/>
  //       </div>
  //       <div className="InputItem">
  //         <p>Store Credit:</p>
  //         <input type="checkbox" onChange={(event) => {
  //           if (event.target.value == "on") {
  //             setStoreCredit(true)
  //           } else {
  //             setStoreCredit(false)
  //           }
  //         }}/>
  //       </div>
  //       <div className="InputItem">
  //         <p>Sell:</p>
  //         <input type="checkbox" onChange={(event) => {
  //           if (event.target.value == "on") {
  //             setSellCheck(true)
  //           } else {
  //             setSellCheck(false)
  //           }
  //         }}/>
  //       </div>
  //       <div className="InputItem">
  //         <p>Transaction ID:</p>
  //         <input type="number" onChange={(event) => setTransactionID(event.target.value)}/>
  //       </div>
  //       <div className="InputItem">
  //         <p>PO #:</p>
  //         <input type="number" onChange={(event) => setPONum(event.target.value)}/>
  //       </div>
  //       <input type="button" className='submitButton' value="Submit" onClick={() => createItem()} />
  //     </div>
  //     <ReactTable setItems={setItems} />
  //   </div>
  // );
}

export default CreateItem;
