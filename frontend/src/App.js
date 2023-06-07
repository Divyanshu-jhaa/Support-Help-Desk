import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
function App() {
  const location=useLocation();
  return (

    <>
       <Routes>
        <Route path="/" exact element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </>
  );
}

export default App;
