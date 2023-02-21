import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CreateItem from './CreateItem';
import Dashboard from "./Dashboard"
import CardPage from './CardPage';
import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Routes,
  RouterProvider,
  Redirect,
  Navigate,
} from "react-router-dom";
import { SocketContext, socket } from './context/SocketContext';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';

import { ProSidebarProvider } from 'react-pro-sidebar';

import theme from './theme';
import SideBar from './SideBar';
import { Box } from '@mui/system';

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
            <SideBar />
            <BrowserRouter>  
              <Routes>
                <Route path='/create-item' exact={true} element={<CreateItem />} />
                <Route path="/card/:id" element={<CardPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path='*' element={<Navigate to="/dashboard" replace={true} />} />
              </Routes>
            </BrowserRouter>
          </Box>

        </ProSidebarProvider>
      </SocketContext.Provider>
    </ThemeProvider>
  </LocalizationProvider>
);