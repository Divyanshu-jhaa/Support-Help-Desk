import React from "react";
import { useState,useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { VideoCallContext } from "./contexts/VideoCallContext";
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
  const [ stream, setStream ] = useState()
	const [ receivingCall, setReceivingCall ] = useState(false)
	const [ caller, setCaller ] = useState("")
	const [ callerSignal, setCallerSignal ] = useState()
	const [ callAccepted, setCallAccepted ] = useState(false)
	const [ idToCall, setIdToCall ] = useState("")
	const [ callEnded, setCallEnded] = useState(false)
	const [ name, setName ] = useState("")
	const myVideo = useRef()
	const userVideo = useRef()
	const connectionRef= useRef()
  return (


    <>    
    <VideoCallContext.Provider value={{stream,setStream,receivingCall,setReceivingCall,caller,setCaller,callerSignal,setCallerSignal,callAccepted,setCallAccepted,idToCall,setIdToCall,callEnded,setCallEnded,name,setName,myVideo,userVideo,connectionRef,socket}}>
       <Routes>
   
         <Route path="/" exact element={<Navigate to="/authentication" replace />} />
        <Route path="/authentication" element={<Authentication/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/user" element={<User socket={socket}/>}/>
        <Route path="/usersupport" element={<UserSupport socket={socket}/>}/>
        <Route path="/videocall" element={<Videocall socket={socket}/>}/>

   
      

      </Routes>
          </VideoCallContext.Provider>
    </>
  );
}

export default App;
