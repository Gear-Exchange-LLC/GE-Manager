import React, { useState } from "react";
import { Box,  Button, Avatar } from "@mui/material";
import { SocketContext } from "./context/SocketContext";
import StorageIcon from '@mui/icons-material/Storage';
import AddIcon from '@mui/icons-material/Add';

import { Add } from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";

import DashboardIcon from '@mui/icons-material/Dashboard';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

import styled from "styled-components";

const SideBar = () => {

  const [ location, setLocation ] = useState(window.location.pathname);

    const StyledLink = styled(Link)`
      color: white;
      text-decoration: none;
      width: 65px;
      height: 50px;
      padding: 5px;
      display: grid;
      place-items: center;
      
      border-right: ${props => props.to === location ? "0px" : "2px"} solid red;

      transition: all 0.25s ease-in-out;

      :hover {
        background-color: #2B2B2B;
      }
    `
  
    return (
        <Box sx={{
            width: "65px",
            minWidth: "65px",
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
              <StyledLink to="/dashboard" onClick={() => setLocation(window.location.pathname)}><FontAwesomeIcon icon={solid('house')} width="100%" height="100%" fontSize="24px" /></StyledLink>
              <StyledLink to="/create-item" onClick={() => setLocation(window.location.pathname)}><FontAwesomeIcon icon={solid('plus')} width="100%" height="100%" fontSize="24px" /></StyledLink>
            </Box>
          </Box>
    )
}

export default SideBar;