import { Box, Typography, Button, TextField, Snackbar, CircularProgress } from "@mui/material";
import React, { useEffect, useContext } from "react";
import { SocketContext } from "./context/SocketContext";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import EditTable from "./EditTable"

function EditItem() {
  
  const socket = useContext(SocketContext);

  const { id } = useParams();

  const [date, setDate] = React.useState()
  const [FirstName, setFirstName] = React.useState();
  const [LastName, setLastName] = React.useState("");
  const [DriversLicenseNum, setDriversLicenseNum] = React.useState();
  const [PhoneNumber, setPhoneNumber] = React.useState();
  const [StoreCredit, setStoreCredit] = React.useState(false);
  const [SellCheck, setSellCheck] = React.useState(false);
  const [TransactionID, setTransactionID] = React.useState();
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

    socket.emit("edit-item", JSON.stringify(value))
  }

  useEffect(() => {

    socket.on("data", (data) => {
      console.log("Socket")
      data.map((item) => {
        var item = JSON.parse(item)
        if (item.transactionID == id) {
          setFirstName(item.firstName)
          setLastName(item.lastName)
          setDriversLicenseNum(item.driversLicense)
          setPhoneNumber(item.phoneNumber)
          setStoreCredit(item.storeCredit)
          setSellCheck(item.sell)
          setTransactionID(item.transactionID)
          
          setItems(item.items)
          setDate(item.date)
        }
      })
    })

    socket.on("edited", (socket) => {
        navigate("/card/test")
        setLoading(false);
    })
    
    socket.emit("get-data");
  }, [])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };

  const handleChange = (newValue) => {
    setDate(newValue);
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
              inputFormat="MM/dd/yyyy"
              renderInput={(params) => <TextField size="small" sx={{ margin: "8px", marginLeft: "0px" }} {...params} />}
              value={date}
              onChange={handleChange}
            />
            {console.log(date)}
            <TextField sx={{margin: "8px", width: "450px"}} size="small" id="transactionIDInput" label="Transaction ID" variant="outlined" InputLabelProps={{ shrink: true }} value={TransactionID} onChange={(event) => { setTransactionID(event.target.value) }} />
          </Box>
          <Typography variant="h3" marginTop={5} marginBottom={2}>Customer Info:</Typography>
          <Box sx={{
            display: "flex",
            width: "100%",
            flexWrap: "wrap"
          }}>
            <Box marginRight={1} marginTop={1} height="fit-content">
              <TextField sx={inputStyle} size="small" id="firstNameInput" label="First Name" variant="outlined" InputLabelProps={{ shrink: true }} value={FirstName} onChange={(event) => { setFirstName(event.target.value); console.log(event.target.value) }} />
            </Box>
            <Box marginRight={1} marginTop={1} height="fit-content">
              <TextField sx={inputStyle} size="small" id="lastNameInput" label="Last Name" variant="outlined" InputLabelProps={{ shrink: true }} value={LastName} onChange={(event) => { setLastName(event.target.value) }} />
            </Box>
            <Box marginRight={1} marginTop={1} height="fit-content">
              <TextField sx={inputStyle} size="small" id="driversLicenseInput" label="Drivers License #" InputLabelProps={{ shrink: true }} value={DriversLicenseNum} variant="outlined" onChange={(event) => { setDriversLicenseNum(event.target.value) }} />
            </Box>
            <Box marginRight={1} marginTop={1} height="fit-content">
              <TextField sx={inputStyle} size="small" id="phoneNumberInput" label="Phone Number" variant="outlined" InputLabelProps={{ shrink: true }} value={PhoneNumber} onChange={(event) => { setPhoneNumber(event.target.value) }} />
            </Box>
          </Box>
{/* 
          <FormGroup>
            <FormControlLabel control={<Checkbox onChange={(event) => { if (event.target.value == "on") { setStoreCredit(true) } else { setStoreCredit(false) }}} />} label="Store Credit" />
            <FormControlLabel control={<Checkbox onChange={(event) => { if (event.target.value == "on") { setSellCheck(true) } else { setSellCheck(false) }}} />} label="Sell" />
          </FormGroup> */}
          <Typography variant="h3" margin={0} marginTop={4} >Items:</Typography>
          <Box sx={{ width: "100%" }}>
            <EditTable setItems={setItems} tableInitialData={items} />
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

export default EditItem;