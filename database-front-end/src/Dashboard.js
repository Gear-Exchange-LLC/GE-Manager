import { Box, AppBar, Toolbar, Typography, Button, Container, Card, CardHeader, CardContent, Avatar, IconButton, Select, MenuItem } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { SocketContext } from "./context/SocketContext";
import StorageIcon from '@mui/icons-material/Storage';
import AddIcon from '@mui/icons-material/Add';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Add } from "@mui/icons-material";

import { Link, Navigate, useNavigate } from "react-router-dom";

function custom_sort(a, b, sortOrder, sortType) {
  a = JSON.parse(a)
  b = JSON.parse(b)
  
  console.log(a)
  console.log(b)
  if (sortType === 'alphabetical') {
    return sortOrder === 'asc' ? a.firstName.localeCompare(b.firstName) : b.firstName.localeCompare(a.firstName);
  } else if (sortType === 'items') {
    return sortOrder === 'asc' ? b.items.length - a.items.length : a.items.length - b.items.length;
  } else {
    return sortOrder === 'asc' ? new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime() : new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime();
  }
}

function Dashboard() {

    const socket = useContext(SocketContext);

    const [data, setData] = React.useState([]);
    const [sortOrder, setSortOrder] = React.useState('asc');  
    const [sortType, setSortType] = React.useState('time');

    const navigate = useNavigate()

    useEffect(() => {
        socket.on("update", (data) => {
            setData(data)
        })
        socket.on("connect", (value) => {
          
        })

        socket.emit("request-update");
    }, [])

    const handleSortChange = () => {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    }

    const handleSortTypeChange = (event) => {
      setSortType(event.target.value);
    }

    return (
        <Box sx={{
          height: "calc(100vh - 60px)",
          overflow: "scroll",
          width: "100%"
        }}>
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%"
            }}>
                <Typography variant="h3" marginTop={2}>In Progress Tickets:</Typography>
                <Button onClick={handleSortChange}>Sort</Button> 
                <Select
                  value={sortType}
                  onChange={handleSortTypeChange}
                >
                  <MenuItem value="time">Time</MenuItem>
                  <MenuItem value="alphabetical">Alphabetical</MenuItem>
                  <MenuItem value="items">Number of Items</MenuItem>
                </Select>
                {data.length == 0 ? (<Typography variant="h3" marginTop={3}>No Items</Typography>) :  data.sort((a, b) => custom_sort(a, b, sortOrder, sortType)).map(function (value, index, array) {

                value = JSON.parse(value)

                if (value.completed) return <></>;

                return (
                  <Card sx={{margin: 2, maxWidth: 600, width: "100%", cursor: "pointer", 
                  ':hover': {
                    boxShadow: 5,
                  }, 
                  }} onClick={() => navigate("/card/" + value.transactionID)}>
                      <CardContent>
                        <Typography variant="h4">{value.firstName} {value.lastName}</Typography>
                        <Typography variant="h7" sx={{ mb: 1.5 }} >{value.items.length} Items <br /></Typography>
                      </CardContent>
                  </Card>
              )
            })} 

            { data.length == 0 ? <></> : <Typography variant="h3" marginTop={2}>Completed Tickets:</Typography>}
            {data.sort((a, b) => custom_sort(a, b, sortOrder, sortType)).map(function (value, index, array) {

                value = JSON.parse(value)

                if (!value.completed) return <></>;

                return (
                <Card sx={{margin: 2, maxWidth: 600, width: "100%", cursor: "pointer", 
                ':hover': {
                    boxShadow: 5,
                }, 
                }} onClick={() => navigate("/card/" + value.transactionID)}>
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
