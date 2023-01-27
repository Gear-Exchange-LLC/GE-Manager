import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CreateItem from './CreateItem';
import Dashboard from "./Dashboard"
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SocketContext.Provider value={socket}>
    <BrowserRouter>  
      <Routes>
        <Route path='/create-item' exact={true} element={<CreateItem />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='*' element={<Navigate to="/dashboard" replace={true} />} />
      </Routes>
    </BrowserRouter>
  </SocketContext.Provider>
);