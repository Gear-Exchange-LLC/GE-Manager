import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CreateItem from './CreateItem';
import Dashboard from "./Dashboard"
import CardPage from './CardPage';
import EditItem from "./EditItem"
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { SocketContext, socket } from './context/SocketContext';
import { ThemeProvider, CssBaseline, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';

import { ProSidebarProvider } from 'react-pro-sidebar';

import { AppBar, Toolbar } from '@mui/material';

import theme from './theme';
import SideBar from './SideBar';
import { Box } from '@mui/system';
import { Button } from '@mui/material';
import SearchItemsPage from './SearchItemsPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <SocketContext.Provider value={socket}>
        <ProSidebarProvider>
          <Box sx={{
            display: "flex",
            width: "100vw"
          }}>
            <BrowserRouter>  
              <SideBar />
              <Box sx={{ width: "100%" }}>
                <AppBar sx={{ height: "60px" }} position="static">
                  <Toolbar>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                      Gear Exchange DB Manager
                    </Typography>
                    <Button variant='contained' color="secondary" onClick={() => window.document.documentElement.requestFullscreen()}>Fullscreen</Button>
                  </Toolbar>
                </AppBar>
                <Routes>
                  <Route path='/create-item' exact={true} element={<CreateItem />} />
                  <Route path="/card/:id" element={<CardPage />} />
                  <Route path="/edit/:id" element={<EditItem />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/search" element={<SearchItemsPage />} />
                  <Route path='*' element={<Navigate to="/dashboard" replace={true} />} />
                </Routes>
              </Box>
            </BrowserRouter>
          </Box>

        </ProSidebarProvider>
      </SocketContext.Provider>
    </ThemeProvider>
  </LocalizationProvider>
);