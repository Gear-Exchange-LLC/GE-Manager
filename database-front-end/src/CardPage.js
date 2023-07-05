import React, { useContext, useEffect, useState, useMemo } from "react";
import { SocketContext } from "./context/SocketContext";
import { useParams } from "react-router-dom";

import { Box, Button, useTheme, Typography, Stack, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from "@mui/material";

import { useNavigate } from "react-router-dom";

function CardPage() {

    const socket = useContext(SocketContext);

    const { id } = useParams();

    const theme = useTheme();

    const [data, setData] = useState({items: []});

    const [editLoading, setEditLoading] = React.useState(false);
    const [deleteLoading, setDeleteLoading] = React.useState(false);
    const [createListingLoading, setCreateListingLoading] = React.useState(false);
    const [editListingLoading, setEditListingLoading] = React.useState(false);
    const [completeLoading, setCompleteLoading] = React.useState(false);

    const navigate = useNavigate()

    socket.emit("get-data");

    useEffect(() => {
      socket.on("data", (data) => {
        data.map((item) => {
          var item = JSON.parse(item)
          if (item.transactionID == id) {
            setData(item)
            setCompleteLoading(false);
            setCreateListingLoading(false);
            setEditListingLoading(false);
            setDeleteLoading(false);
          }
        })
      })

      socket.on("reverb", (socket) => {
        console.log("Test")
        setCreateListingLoading(false);
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
          accessorKey: 'condition', //access nested data with dot notation
          header: 'Condition',
        },
        {
          accessorKey: 'category', //access nested data with dot notation
          header: 'Category',
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
        },
        {
          header: ' ',
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

      await socket.emit("deleteItem", data.transactionID)
    }

    const createListing = async () => {
      
      setCreateListingLoading(true);

      await socket.emit("create-reverb", data)
    }

    const editListing = async () => {
      
      setEditListingLoading(true);

      navigate("/edit/" + data.transactionID)
    }

    const markComplete = async () => {
      
      setCompleteLoading(true);

      await socket.emit("set-complete", data)
    }

    return (
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 60px)",
        width: "100%",
      }}>
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
        <Stack direction="row" spacing={2} justifyContent="end" paddingRight={0} width="90%" marginBottom={2} marginLeft={"5%"}>
          <Button color="primary" variant="outlined" sx={{ width: 200 }} disabled={createListingLoading || data.reverbCreated == true} onClick={() => createListing()}>Create Listing {createListingLoading && (
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
          <Button color="primary" variant={ data.completed ? "outlined" : "contained"} sx={{ width: 200 }} disabled={completeLoading} onClick={() => markComplete()}>{ data.completed ? "Mark as UnComplete" : "Mark as Complete" }{deleteLoading && (
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
                    <TableCell>{
                      { 
                        "7c3f45de-2ae0-4c81-8400-fdb6b1d74890": "Brand New",
                        "ac5b9c1e-dc78-466d-b0b3-7cf712967a48": "Mint",
                        "df268ad1-c462-4ba6-b6db-e007e23922ea": "Excellent",
                        "ae4d9114-1bd7-4ec5-a4ba-6653af5ac84d": "Very Good",
                        "f7a3f48c-972a-44c6-b01a-0cd27488d3f6": "Good",
                        "98777886-76d0-44c8-865e-bb40e669e934": "Fair",
                        "fbf35668-96a0-4baa-bcde-ab18d6b1b329": "Non Functioning"
                      }[row.condition]
                    }</TableCell>
                    <TableCell>{
                      { 
                        "62835d2e-ac92-41fc-9b8d-4aba8c1c25d5": "Accessories",
                        "3ca3eb03-7eac-477d-b253-15ce603d2550": "Acoustic Guitars",
                        "09055aa7-ed49-459d-9452-aa959f288dc2": "Amps",
                        "032c74d0-b0e2-4442-877f-e1a22438a7fa": "Band and Orchestra",
                        "53a9c7d7-d73d-4e7f-905c-553503e50a90": "Bass Guitars",
                        "58d889f7-0aa1-4689-a9d3-da16dd225e8d": "DJ And Lighting Gear",
                        "b3cb9f8e-4cb6-4325-8215-1efcd9999daf": "Drums and Percussion",
                        "fa10f97c-dd98-4a8f-933b-8cb55eb653dd": "Effects and Pedals",
                        "dfd39027-d134-4353-b9e4-57dc6be791b9": "Electric Guitars",
                        "fb60628c-be4b-4be2-9c0f-bc5d31e3996c": "Folk Instruments",
                        "40e8bfd0-3021-43f7-b104-9d7b19af5c2b": "Home Audio",
                        "d002db05-ab63-4c79-999c-d49bbe8d7739": "Keyboards and Synths",
                        "1f99c852-9d20-4fd3-a903-91da9c805a5e": "Parts",
                        "b021203f-1ed8-476c-a8fc-32d4e3b0ef9e": "Pro Audio"
                      }[row.category]
                    }</TableCell>
                    <TableCell>{row.stock}</TableCell>
                    <TableCell>${row.listPrice.includes(".") ? row.listPrice : row.listPrice + ".00"}</TableCell>
                    <TableCell>${row.purchaseAmount.includes(".") ? row.purchaseAmount : row.purchaseAmount + ".00"}</TableCell>
                    <TableCell sx={{margin: 0, padding: 0, width: "fit-content"}}>{row.squareID ? <Button color="primary" variant="contained" size="small" sx={{margin: 0}} onClick={() => document.location.href = ("https://squareup.com/dashboard/items/library/" + row.squareID)}>Go to Square Item</Button> : <></>}</TableCell>
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
          <Button color="primary" variant="outlined" sx={{ width: 200 }} disabled={editListingLoading} onClick={() => editListing()}>Edit {editListingLoading && (
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
