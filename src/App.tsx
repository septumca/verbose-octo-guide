import { useState } from 'react';
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import './App.css';

import Root, { loader as rootLoader } from './components/Root';
import Login from './components/Login';

const router = createBrowserRouter([
  {
    path: "/",
    loader: rootLoader,
    element: <Root />,
  },
  {
    path: "/login",
    element: <Login />,
  }
]);

function App() {
  return (
      <RouterProvider router={router} />
  )
}

export default App
