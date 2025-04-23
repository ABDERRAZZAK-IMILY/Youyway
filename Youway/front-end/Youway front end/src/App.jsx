import React from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/index.jsx';
import './js/echo.jsx';
function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;