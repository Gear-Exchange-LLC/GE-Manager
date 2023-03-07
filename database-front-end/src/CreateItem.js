import { Box, AppBar, Toolbar, Typography, Button, TextField, Checkbox, FormGroup, FormControlLabel, Snackbar, CircularProgress } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useState, useEffect, useContext, dispatch, useReducer } from "react";
import { SocketContext } from "./context/SocketContext";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import EditTable from "material-ui-table-edit"

import uuid from "react-uuid"

import dayjs from "dayjs"

import { DesktopDatePicker } from "@mui/x-date-pickers";
import ReactTable from "./Table";
import { display, width } from "@mui/system";
import { Link, Navigate, useNavigate } from "react-router-dom";


function CreateItem() {
  
  const socket = useContext(SocketContext);

  const [date, setDate] = React.useState(new Date());
  const [FirstName, setFirstName] = React.useState("");
  const [LastName, setLastName] = React.useState("");
  const [DriversLicenseNum, setDriversLicenseNum] = React.useState();
  const [PhoneNumber, setPhoneNumber] = React.useState();
  const [StoreCredit, setStoreCredit] = React.useState(false);
  const [SellCheck, setSellCheck] = React.useState(false);
  const [TransactionID, setTransactionID] = React.useState(uuid());
  const [items, setItems] = React.useState();

  const navigate = useNavigate()

  const [openSnack, setOpenSnack] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  function createItem() {

    if (FirstName === "" || LastName === "" || items === []) {

      console.log("Please Fill Out")

      setOpenSnack(true);

      return;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.condition == "pick-one" || item.category == "pick-one") {
        return;
      }
    }

    const value = { date: date, timeCreated: new Date().toISOString(), firstName: FirstName, lastName: LastName, driversLicense: DriversLicenseNum, phoneNumber: PhoneNumber, storeCredit: StoreCredit, sell: SellCheck, transactionID: TransactionID, completed: false, reverbCreated: false, items: items }

    setLoading(true);

    socket.emit("create-item", JSON.stringify(value))
  }

  useEffect(() => {
    socket.on("created", (socket) => {
        navigate("/dashboard")
        setLoading(false);
    })
  })

  const [value, setValue] = React.useState(
    new dayjs(),
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
    width: "200px",
  }

  return (
    <Box sx={{
      height: "calc(100vh - 60px)",
      overflow: "scroll"
    }}>
      <Box sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "20px"
      }}>
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          width: "75%",
        }}>
          <Box className="InputItem" sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }} >
            <DesktopDatePicker
              label="Date"
              inputFormat="mm/dd/yyyy"
              renderInput={(params) => <TextField size="small" sx={{ margin: "8px", marginLeft: "0px" }} {...params} />}
              value={value}
              onChange={handleChange}
            />
            <TextField sx={{margin: "8px", width: "450px"}} size="small" id="transactionIDInput" label="Transaction ID" variant="outlined" disabled  value={TransactionID} onChange={(event) => { setTransactionID(event.target.value) }} />
          </Box>
          <Typography variant="h3" marginTop={5} marginBottom={2}>Customer Info:</Typography>
          <Box sx={{
            display: "flex",
            width: "100%",
            flexWrap: "wrap"
          }}>
            <Box marginRight={1} marginTop={1} height="fit-content">
              <TextField sx={inputStyle} size="small" id="firstNameInput" label="First Name" variant="outlined" onChange={(event) => { setFirstName(event.target.value) }} />
            </Box>
            <Box marginRight={1} marginTop={1} height="fit-content">
              <TextField sx={inputStyle} size="small" id="lastNameInput" label="Last Name" variant="outlined"  onChange={(event) => { setLastName(event.target.value) }} />
            </Box>
            <Box marginRight={1} marginTop={1} height="fit-content">
              <TextField sx={inputStyle} size="small" id="driversLicenseInput" label="Drivers License #" variant="outlined" onChange={(event) => { setDriversLicenseNum(event.target.value) }} />
            </Box>
            <Box marginRight={1} marginTop={1} height="fit-content">
              <TextField sx={inputStyle} size="small" id="phoneNumberInput" label="Phone Number" variant="outlined" onChange={(event) => { setPhoneNumber(event.target.value) }} />
            </Box>
          </Box>
{/* 
          <FormGroup>
            <FormControlLabel control={<Checkbox onChange={(event) => { if (event.target.value == "on") { setStoreCredit(true) } else { setStoreCredit(false) }}} />} label="Store Credit" />
            <FormControlLabel control={<Checkbox onChange={(event) => { if (event.target.value == "on") { setSellCheck(true) } else { setSellCheck(false) }}} />} label="Sell" />
          </FormGroup> */}
          <Typography variant="h3" margin={0} marginTop={4} >Items:</Typography>
          <Box sx={{ width: "100%" }}>
            <ReactTable setItems={setItems} />
          </Box>
          <Box sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end"
          }}>
            <Button variant="contained" color="primary" disabled={loading} size="large" sx={{width: 200, margin: 3, marginRight: 0}} onClick={() => createItem()}>
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

        </Box>
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
}

export default CreateItem;
