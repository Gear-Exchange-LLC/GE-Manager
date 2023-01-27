import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/create-item' exact={true} element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='*' element={<Navigate to="/dashboard" replace={true} />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);