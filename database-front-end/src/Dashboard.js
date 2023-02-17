import { Box, AppBar, Toolbar, Typography, Button, Container, Card, CardHeader, CardContent } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { SocketContext } from "./context/SocketContext";

function custom_sort(a, b) {
  return new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime();
}

function Dashboard() {

    const socket = useContext(SocketContext);

    const [data, setData] = React.useState([]);

    useEffect(() => {
        socket.on("update", (socket) => {
            console.log(socket.items)
            setData(socket.items)
        })
        socket.on("connect", (value) => {
          console.log(socket.id)
        })
      })

    return (
    <Box sx={{
      /* background-color: #282c34; */
      height: "100vh"
    }}>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              Gear Exchange DB Manager
            </Typography>
            <Button color="secondary" variant="contained" onClick={() => window.location.href = "/create-item"}>Create Item</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%"
      }}>
          {data.length == 0 ? (<Typography variant="h3" marginTop={3}>No Items</Typography>) :  data.sort(custom_sort).reverse().map(function (value, index, array) {

              value = JSON.parse(value)

              return (
                  <Card sx={{margin: 2, maxWidth: 600, width: "100%", cursor: "pointer", 
                  ':hover': {
                    boxShadow: 5,
                  }, 
                  }} onClick={() => window.location.href = "/card/" + value.transactionID}>
                      <CardContent>
                        <Typography variant="h4">{value.firstName} {value.lastName}</Typography>
                        <Typography variant="h7" sx={{ mb: 1.5 }} >{value.items.length} Items <br /></Typography>
                      </CardContent>
                  </Card>
              )
          })} 
      </Box>
    </Box>
  );
}

export default Dashboard;
