import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Authentication from "./pages/Authentication";
import Admin from "./pages/Admin";
import User from "./pages/User";
import Videocall from "./pages/Videocall";
import Chatbot from "./pages/Chatbot/Chatbot";
import UserSupport from "./pages/UserSupport";
import io from "socket.io-client"
let socket = io.connect("http://localhost:5000");
function App() {
  const location=useLocation();

  return (


    <>
       <Routes>
        <Route path="/" exact element={<Navigate to="/authentication" replace />} />
        <Route path="/authentication" element={<Authentication/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/user" element={<User socket={socket}/>}/>
        <Route path="/usersupport" element={<UserSupport socket={socket}/>}/>
        <Route path="/videocall" element={<Videocall socket={socket}/>}/>
      

      </Routes>
    </>
  );
}

export default App;
