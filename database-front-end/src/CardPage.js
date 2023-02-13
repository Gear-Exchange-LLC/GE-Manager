import React, { useContext, useEffect, useState, useMemo } from "react";
import './App.css';
import { SocketContext } from "./context/SocketContext";
import { useParams } from "react-router-dom";

import MaterialReactTable from 'material-react-table';
import { Box, Button, Grid, useTheme, AppBar, Toolbar, Typography, Stack } from "@mui/material";
import { width } from "@mui/system";

function CardPage() {

    const socket = useContext(SocketContext);

    const { id } = useParams();

    const theme = useTheme();

    const [data, setData] = useState({items: []});

    socket.emit("get-data");

    useEffect(() => {
      socket.on("data", (data) => {
        data.map((item) => {
          var item = JSON.parse(item)
          if (item.transactionID == id) {
            setData(item)
          }
        })
      })
    })


    const columns = useMemo(
      () => [
        {
          accessorKey: "make",
          header: "Make"
        },
        {
          accessorKey: 'model', //access nested data with dot notation
          header: 'Brand',
        },
        {
          accessorKey: 'included', //access nested data with dot notation
          header: 'Included',
        },
        {
          accessorKey: 'condition', //access nested data with dot notation
          header: 'Condition',
        },
        {
          accessorKey: 'x', //access nested data with dot notation
          header: 'X',
        },
        {
          accessorKey: 'percent', //access nested data with dot notation
          header: 'Percent',
        },
        {
          accessorKey: 'storeCredit', //access nested data with dot notation
          header: 'Store Credit',
        },
        {
          accessorKey: 'purchaseAmount', //access nested data with dot notation
          header: 'Purchase Amount',
        },
        {
          accessorKey: 'sku', //access nested data with dot notation
          header: 'SKU',
        },
        {
          accessorKey: 'storeCreditCheck', //access nested data with dot notation
          header: 'Store Credit',
        },
        {
          accessorKey: 'sellCheck', //access nested data with dot notation
          header: 'Sell Check',
          type: "boolean"
        },
        {
          accessorKey: "complete",
          header: "Is Complete"
        }
      ],
      [],
    );

    function formatPhoneNumber(phoneNumberString) {
      var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
      var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        var intlCode = (match[1] ? '+1 ' : '');
        return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
      }
      return null;
    }

    var tableOptions = {
      rowStyle: rowData => console.log(rowData)
    }

    return (
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
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
        <Box bgcolor={theme.palette.dataCard} sx={{
          width: "500px",
          height: "170px",
          borderRadius: "10px",
          margin: "30px",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}>
          <Typography variant="h4" component="div" sx={{flexGrow: 1, fontWeight: "bold"}}>{data.firstName} {data.lastName}</Typography>
          <Box sx={{

          }}>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
              <Typography variant="h5">Phone:</Typography>
              <Typography variant="h5" sx={{fontWeight: "bold"}}>{formatPhoneNumber(data.phoneNumber)}</Typography>
            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
              <Typography variant="h5">Drivers License:</Typography>
              <Typography variant="h5" sx={{fontWeight: "bold"}}>{data.driversLicense}</Typography>
            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
              <Typography variant="h5">Transaction ID:</Typography>
              <Typography variant="h5" sx={{fontWeight: "bold"}}>{data.transactionID}</Typography>
            </Box>
          </Box>
        </Box>
        <Box className="itemWrapper">
          <MaterialReactTable columns={columns} data={data.items} options={tableOptions}/>
        </Box>
        <Stack direction="row" spacing={2} justifyContent="end" paddingRight={2} width="100%">
          <Button color="primary" variant="outlined" sx={{ width: 200 }} onClick={() => console.log("edit")}>Edit</Button>
          <Button color="primary" variant="contained" sx={{ width: 200 }} onClick={() => console.log("delete")}>Delete</Button>
        </Stack>
      </Box>
    );
    
    // return (
    //   <div className="CardPage">
    //     <div className="Header">
    //       <h1>Gear Exchange Database</h1>
    //       <Button variant="contained" style={{ width: "200px" }}>Back to Dashboard</Button>
    //     </div>
    //     <div className="dataWrapper">
    //       <h1>{data.firstName} {data.lastName}</h1>
    //       <div>
    //         <span>
    //           <h2>Phone:</h2>
    //           <h2>{formatPhoneNumber(data.phoneNumber)}</h2>
    //         </span>
    //         <span>
    //           <h2>Drivers License:</h2>
    //           <h2>{data.driversLicense}</h2>
    //         </span>
    //         <span>
    //           <h2>Transaction ID:</h2>
    //           <h2>{data.transactionID}</h2>
    //         </span>
    //       </div>
    //     </div>
    //     <div className="itemWrapper">
    //       <MaterialReactTable columns={columns} data={data.items} />
    //     </div>
    //     <div className="buttonWrapper">
    //       <input type="button" className='submitButton' style={{marginRight: "10px"}} value="Edit" onClick={() => console.log("test")} />
    //       <input type="button" className='submitButton' value="Delete" onClick={() => console.log("test")} />
    //     </div>
    //   </div>
    // );
}

export default CardPage;
