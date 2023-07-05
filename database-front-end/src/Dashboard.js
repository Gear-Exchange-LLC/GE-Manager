  import { Box, Typography, Button, Card, CardContent, Select, MenuItem, TextField } from "@mui/material";
  import React, { useContext, useEffect } from "react";
  import { SocketContext } from "./context/SocketContext";

  import { ArrowUpward } from "@mui/icons-material";

  import { useNavigate } from "react-router-dom";

  function custom_sort(a, b, sortOrder, sortType) {
    a = JSON.parse(a)
    b = JSON.parse(b)
    
    console.log(a)
    console.log(b)
    if (sortType === 'alphabetical') {
      return sortOrder === 'desc' ? a.firstName.localeCompare(b.firstName) : b.firstName.localeCompare(a.firstName);
    } else if (sortType === 'items') {
      return sortOrder === 'desc' ? b.items.length - a.items.length : a.items.length - b.items.length;
    } else {
      return sortOrder === 'desc' ? new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime() : new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime()
    }
  }

  function Dashboard() {

      const socket = useContext(SocketContext);

      const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

      const [itemData, setItemData] = React.useState([]);
      const [data, setData] = React.useState([]);
      const [sortOrder, setSortOrder] = React.useState('desc');  
      const [sortType, setSortType] = React.useState('time');

      const navigate = useNavigate()

      useEffect(() => {
          socket.on("update", (data) => {
              setData(data);
              setItemData(data);
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
          <Box id="items-wrapper" sx={{
            height: "calc(100vh - 60px)",
            overflow: "scroll",
            width: "100%"
          }}>
            <Box sx={{display: "flex", height: "60px", justifyContent: "center", alignItems: "center"}} marginTop={2}>
              <Typography variant="h6" marginRight={1}>Sort By:</Typography>
              <Select
                value={sortType}
                onChange={handleSortTypeChange}
                sx={{height: "40px"}}
              >
                <MenuItem value="time">Date</MenuItem>
                <MenuItem value="alphabetical">Alphabetical</MenuItem>
                <MenuItem value="items">Number of Items</MenuItem>
              </Select>
              <Button sx={{marginInline: 2}} onClick={handleSortChange}>{sortOrder}</Button> 
              <Box sx={{ display: "flex", alignItems: "center"}}>
                <TextField id="search-input" label="Search" variant="filled" onChange={(event) => { itemData.map(item => console.log(item)); setData(itemData.filter(item => (JSON.parse(item).firstName.toLowerCase() + " " + JSON.parse(item).lastName.toLowerCase()).includes(event.target.value.toLowerCase()))); console.log(event.target.value.toLowerCase());}}/>
              </Box>
            </Box>
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%"
            }}>
                <Typography variant="h3" marginTop={2}>In Progress Tickets:</Typography>
                {data.length == 0 ? (<Typography variant="h3" marginTop={3}>No Items</Typography>) :  data.sort((a, b) => custom_sort(a, b, sortOrder, sortType)).map(function (value, index, array) {

                  value = JSON.parse(value)

                  if (value.completed) return <></>;

                  return (
                    <Card sx={{margin: 2, position: "relative", maxWidth: 600, width: "100%", cursor: "pointer", 
                    ':hover': {
                      boxShadow: 5,
                    }, 
                    }} onClick={() => navigate("/card/" + value.transactionID)}>
                      {console.log(value)}
                        <CardContent position="relative">
                          <Typography variant="h4">{value.firstName} {value.lastName}</Typography>
                          <Typography variant="h7" sx={{ mb: 1.5 }} >{value.items.length} Items <br /></Typography>
                          <Typography sx={{position: "absolute", top: "10px", right: "10px", color: "#6B6B6B", fontWeight: "bold"}} variant="p">{`${months[new Date(value.date).getMonth()]} ${new Date(value.date).getDate()}, ${new Date(value.date).getFullYear()}`}</Typography>
                        </CardContent>
                    </Card>
                  )
                })} 
                { data.length == 0 ? <></> : <Typography variant="h3" marginTop={2}>Completed Tickets:</Typography>}
                {data.sort((a, b) => custom_sort(a, b, sortOrder, sortType)).map(function (value, index, array) {

                    value = JSON.parse(value)

                    if (!value.completed) return <></>;

                    return (
                    <Card sx={{margin: 2, position: "relative", maxWidth: 600, width: "100%", cursor: "pointer", 
                    ':hover': {
                        boxShadow: 5,
                    }, 
                    }} onClick={() => navigate("/card/" + value.transactionID)}>
                        <CardContent position="relative">
                            <Typography variant="h4">{value.firstName} {value.lastName}</Typography>
                            <Typography variant="h7" sx={{ mb: 1.5 }} >{value.items.length} Items <br /></Typography>
                            <Typography sx={{position: "absolute", top: "10px", right: "10px", color: "#6B6B6B", fontWeight: "bold"}} variant="p">{`${months[new Date(value.date).getMonth()]} ${new Date(value.date).getDate()}, ${new Date(value.date).getFullYear()}`}</Typography>
                        </CardContent>
                    </Card>
                    )
                })} 
            </Box>
            <Button sx={{ borderRadius: "35px", height: "70px", width: "70px", position: "fixed", top: "calc(100vh - 90px)", right: "20px" }} variant="contained" color="primary" onClick={() => window.document.querySelector("#items-wrapper").scrollTo({top: 0, behavior: 'smooth'})}><ArrowUpward /></Button>
        </Box>
    );
  }

  export default Dashboard;
