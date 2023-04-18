import { Box, Button, Typography, TextField } from "@mui/material";
import React, { useEffect, useContext } from "react"
import { SocketContext } from "./context/SocketContext";

import { useNavigate } from "react-router-dom";

const SearchItemsPage = () => {

    const inputStyle = {
        width: "500px",
    }

    const socket = useContext(SocketContext);

    const navigate = useNavigate()

    var [items, setItems] = React.useState([]);

    var [searchItems, setSearchItems] = React.useState([])

    useEffect(() => {
        socket.on("update", (data) => {

            let items_temp = []

            data.map((card, i) => {
                card = JSON.parse(card)
                console.log(card)
                card.items.map((item) => {
                    console.log(item.make)
                    item.originalID = card.transactionID
                    items_temp.push(item)
                })
            })

            // Sort items by SKU
            items_temp.sort((a, b) => {

                const skuA = a.sku ? a.sku : '';
                const skuB = b.sku ? b.sku : '';
                if (skuA < skuB) {
                    return -1;
                }
                if (skuA > skuB) {
                    return 1;
                }

                return 0;
            });

            setItems(items_temp)
            setSearchItems(items_temp)
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
                    <TextField style={inputStyle} size="small" id="searchInput" label="Search" variant="outlined" onChange={(event) => { setSearchItems(items.filter(s => ( s.sku + " " + s.make.toLowerCase() + " " + s.model.toLowerCase()).includes(event.target.value.toLowerCase()))) }} />
                </Box>
                {/* <Button sx={{ marginRight: 1, marginTop: 1 }} variant="contained">Search</Button> */}
            </Box>

            <Box sx={{ paddingInline: "20px", paddingLeft: "15px", height: "calc(100% - 65px)", marginTop: "15px", overflow: "scroll" }}>
                {searchItems.map((item) => {

                    return (
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", height: "50px", border: "1px solid gray", margin: "2px" }}>
                            
                            <Box marginLeft="20px">
                                ({item.sku}) {item.make} {item.model}
                            </Box>
                            <Box marginRight="20px">
                                <Button variant="contained" sx={{ marginRight: .5 }} onClick={() => navigate("/card/" + item.originalID)}>Go to Listing</Button>
                            </Box>
                        </Box>
                    )

                })}
            </Box>
        </Box>
    )
}

export default SearchItemsPage;