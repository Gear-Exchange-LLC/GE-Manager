import { Box, Button, Typography, TextField } from "@mui/material";
import React, { useEffect, useContext } from "react"
import { SocketContext } from "./context/SocketContext";

const SearchItemsPage = () => {

    const inputStyle = {
        width: "500px",
    }

    const socket = useContext(SocketContext);

    var [items, setItems] = React.useState([]);

    useEffect(() => {
        socket.on("update", (data) => {

            let items_temp = []

            data.map((card) => {
                card = JSON.parse(card)
                console.log(card)
                card.items.map((item) => {
                    console.log(item.make)
                    items_temp.push(item)
                })
            })

            // Sort items by SKU
            items_temp.sort((a, b) => {

                const skuA = a.sku ? a.sku.toUpperCase() : '';
                const skuB = b.sku ? b.sku.toUpperCase() : '';
                if (skuA < skuB) {
                    return -1;
                }
                if (skuA > skuB) {
                    return 1;
                }

                return 0;
            });

            setItems(items_temp)
        })

        socket.emit("request-update");
      }, [])

    return (
        <Box sx={{
            height: "calc(100vh - 60px)",
            overflow: "scroll"
          }}>
            <Box sx={{ height: "50px", display: "flex", flexDirection: "row", justifyContent: "center", paddingTop: "10px", paddingRight: "100px", alignItems: "center" }}>
                <Box marginRight={1} marginTop={1} height="fit-content">
                    <TextField style={inputStyle} size="small" id="searchInput" label="Search" variant="outlined" onChange={(event) => { console.log(event.target.value) }} />
                </Box>
                <Button sx={{ marginRight: 1, marginTop: 1 }} variant="contained">Search</Button>
            </Box>

            <Box sx={{ height: "calc(100% - 65px)", marginTop: "15px", overflow: "scroll" }}>
                {items.map((item) => {

                    return (
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", height: "50px", border: "1px solid gray", margin: "2px" }}>
                            
                            <Box marginLeft="20px">
                                ({item.sku}) {item.make} {item.model}
                            </Box>
                            <Box marginRight="20px">
                                <Button variant="outlined" sx={{ marginRight: .5 }}>Go to Listing</Button>
                                <Button variant="contained" sx={{ marginLeft: .5 }}>Add to Label</Button>
                            </Box>
                        </Box>
                    )

                })}
            </Box>
        </Box>
    )
}

export default SearchItemsPage;