import React from 'react'
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
const Videocall = () => {
    const location = useLocation();
    const [me, setMe] = useState("")
    const [stream, setStream] = useState()
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState("")
    const [callerSignal, setCallerSignal] = useState()
    const [callAccepted, setCallAccepted] = useState(false)
    const [idToCall, setIdToCall] = useState("")
    const [callEnded, setCallEnded] = useState(false)
    const [name, setName] = useState("")
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            myVideo.current.srcObject = stream
        })

    }, [])
    return (
        <>
            <div className='w-screen h-screen flex justify-center items-center flex-col md:justify-normal md:items-start md:flex-row'>
                <div className=' md:fixed w-[14rem] h-[10rem]  m-[1rem] '>
                    <video playsInline autoPlay ref={myVideo} className=' rounded-lg'></video>

                </div>
                <div>

                </div>
            </div>
        </>
    )
}

export default Videocall