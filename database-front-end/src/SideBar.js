import React from "react";
import { Box,  Button, Avatar } from "@mui/material";
import { SocketContext } from "./context/SocketContext";
import StorageIcon from '@mui/icons-material/Storage';
import AddIcon from '@mui/icons-material/Add';

import { Add } from "@mui/icons-material";

const SideBar = () => {
    return (
        <Box sx={{
            width: "80px",
            backgroundColor: "#363636",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingBlock: "10px",
            position: "relative"
          }}>
            <Avatar />
            <Box sx={{
              height: "100vh",
              position: "absolute",
              top: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Button sx={{ width: "100%", margin: 0, borderRadius: 0, fontSize: "20px", marginBlock: "10px" }} >
                <Add />
              </Button>
              <Button sx={{ width: "100%", margin: 0, borderRadius: 0, fontSize: "20px", marginBlock: "10px" }} >
                <Add />
              </Button>
            </Box>
          </Box>
    )
}

export default SideBar;