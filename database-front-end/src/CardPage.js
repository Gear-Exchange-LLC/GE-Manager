import React, { useContext, useEffect, useState, useMemo } from "react";
import { SocketContext } from "./context/SocketContext";
import { useParams } from "react-router-dom";

import MaterialReactTable from 'material-react-table';
import { Box, Button, Grid, useTheme, AppBar, Toolbar, Typography, Stack, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from "@mui/material";
import { width } from "@mui/system";

import { Link, Navigate, useNavigate } from "react-router-dom";

function CardPage() {

    const socket = useContext(SocketContext);

    const { id } = useParams();

    const theme = useTheme();

    const [data, setData] = useState({items: []});

    const [editLoading, setEditLoading] = React.useState(false);
    const [deleteLoading, setDeleteLoading] = React.useState(false);

    const navigate = useNavigate()

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

      socket.on("delete-item", (value) => {
        if (value) {
          navigate("/dashboard")
        }
      })
    })


    const columns = [
        {
          accessorKey: 'sku', //access nested data with dot notation
          header: 'SKU',
        },
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
          accessorKey: "stock",
          header: "Stock"
        },
        {
          accessorKey: 'listPrice', //access nested data with dot notation
          header: 'List Price',
        },
        {
          accessorKey: 'purchaseAmount', //access nested data with dot notation
          header: 'Purchase Amount',
        }
      ];

    function formatPhoneNumber(phoneNumberString) {
      var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
      var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        var intlCode = (match[1] ? '+1 ' : '');
        return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
      }
      return null;
    }

    const deleteItem = async () => {
      
      setDeleteLoading(true);

      console.log(data.transactionID)

      await socket.emit("deleteItem", data.transactionID)
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
              <Button color="secondary" variant="contained" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
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
            {/* <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}>
              <Typography variant="h5">Transaction ID:</Typography>
              <Typography variant="h5" sx={{fontWeight: "bold", fontSize: "24px", textAlign: "left", width: "100%"}}>{data.transactionID}</Typography>
            </Box> */}
          </Box>
        </Box>
        <Box sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center"
        }}>
          <TableContainer sx={{
            width: "90%"
          }} component={Paper}>
            <Table sx={{ minWidth: 100 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell>{column.header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.items.map((row) => (
                  <TableRow
                    key={row.sku}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.sku}
                    </TableCell>
                    <TableCell>{row.make}</TableCell>
                    <TableCell>{row.model}</TableCell>
                    <TableCell>{row.included}</TableCell>
                    <TableCell>{row.stock}</TableCell>
                    <TableCell>${row.listPrice.includes(".") ? row.listPrice : row.listPrice + ".00"}</TableCell>
                    <TableCell>${row.purchaseAmount.includes(".") ? row.purchaseAmount : row.purchaseAmount + ".00"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Stack direction="row" spacing={2} justifyContent="end" paddingRight={0} width="90%" marginTop={2} marginLeft={"5%"}>
          {/* <Button color="primary" variant="outlined" sx={{ width: 200 }} onClick={() => console.log("edit")}>Edit {editLoading && (
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
                />)}</Button> */}
          <Button color="primary" variant="contained" sx={{ width: 200 }} disabled={deleteLoading} onClick={() => deleteItem()}>Delete {deleteLoading && (
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
                />)}</Button>
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
