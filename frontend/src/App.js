import React from "react";
import { useState,useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { VideoCallContext } from "./contexts/VideoCallContext";
import { ChatBotContext } from "./contexts/ChatBotContext";
import Authentication from "./pages/Authentication";
import Admin from "./pages/Admin";
import User from "./pages/User";
import Videocall from "./pages/Videocall";
import Chatbot from "./pages/Chatbot/Chatbot";
import UserSupport from "./pages/UserSupport";
import { Navbar } from "./components/Navbar";
import io from "socket.io-client"
let socket = io.connect("http://localhost:5000");
function App() {
  const location=useLocation();
  //chat states

  //video call states
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
    {location.pathname!='/authentication' && location.pathname!='/videocall' &&   <Navbar/>}
       <Routes>
   
         <Route path="/" exact element={<Navigate to="/authentication" replace />} />
        <Route path="/authentication" element={<Authentication/>}/>
        <Route path="/admin" element={!localStorage.getItem('user') ?<Navigate to="/authentication" replace />: <Admin/>}/>
        <Route path="/user" element={!localStorage.getItem('user') ?<Navigate to="/authentication" replace />: <User socket={socket}/>}/>
        <Route path="/usersupport" element={!localStorage.getItem('user') ?<Navigate to="/authentication" replace />: <UserSupport socket={socket}/>}/>
        <Route path="/videocall" element={!localStorage.getItem('user') ?<Navigate to="/authentication" replace />: <Videocall socket={socket}/>}/>

   
      

      </Routes>
    </VideoCallContext.Provider>
    </>
  );
}

export default App;
