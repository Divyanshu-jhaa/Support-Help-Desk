import React from 'react'
import axios from 'axios';
import Peer from 'simple-peer';
import { useState, useRef, useEffect, useContext } from 'react';
import { VideoCallContext } from '../contexts/VideoCallContext';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
const Videocall = () => {
    const { callAccepted, setCallAccepted, stream, setStream, myVideo, userVideo, connectionRef, callEnded, setReceivingCall, setCaller, setName, setCallerSignal, caller, callerSignal, setCallEnded, name, socket, receivingCall } = useContext(VideoCallContext);
    // console.log(socket.id);
    // const [me, setMe] = useState("")
    // const [stream, setStream] = useState()
    // const [receivingCall, setReceivingCall] = useState(false)
    // const [caller, setCaller] = useState("")
    // const [callerSignal, setCallerSignal] = useState()
    // const [callAccepted, setCallAccepted] = useState(false)
    // const [idToCall, setIdToCall] = useState("")
    // const [callEnded, setCallEnded] = useState(false)
    // const [name, setName] = useState("")
    // const myVideo = useRef()
    // const userVideo = useRef()
    // const connectionRef = useRef()
    // useEffect(() => {
    //     navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
    //         setStream(stream)
    //         myVideo.current.srcObject = stream
    //     })

    // }, [])
    const location = useLocation();
    const [id, setid] = useState('');
    const [called, setcalled] = useState(false);
    // console.log(location.state);
    // console.log("the guest user stream is", userVideo.current.srcObject);
    // console.log("the curretn user stream is", myVideo.current.srcObject);
    useEffect(() => {
        if (location.state.id != null && location.state.designation === '1') {
            setid(location.state.id);

        }
        // if (location.state.designation === '1') {
        //     console.log("enteres");

        // }

    }, [])
    useEffect(() => {


        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            myVideo.current.srcObject = stream
        })

        socket.on("callUser", (data) => {
            setReceivingCall(true)
            setCaller(data.from)
            setName(data.name)
            setCallerSignal(data.signal)
        })
    }, [])

    const callUser = (id) => {
        console.log("called");
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: socket.id,
                name: "muk"
            })
        })
        peer.on("stream", (stream) => {

            userVideo.current.srcObject = stream

        })
        socket.on("callAccepted", (signal) => {
            setCallAccepted(true)
            peer.signal(signal)
        })

        connectionRef.current = peer
    }

    const answerCall = () => {
        setCallAccepted(true)
        setReceivingCall(false);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller })
        })
        peer.on("stream", (stream) => {
            console.log("inside stream!!")
            userVideo.current.srcObject = stream
        })

        peer.signal(callerSignal)
        connectionRef.current = peer
    }
    const leaveCall = () => {
        setCallEnded(true)
        connectionRef.current.destroy()
    }

    return (
        <>
            <div className='w-screen h-screen flex justify-center items-center flex-col md:justify-normal md:items-start md:flex-row bg-[#28282B]'>
                <div className='fixed w-screen h-screen flex'>
                    <div className=' w-[14rem] h-[10rem]  m-[1rem] z-10'>
                        <video playsInline autoPlay ref={myVideo} className=' rounded-lg'></video>

                    </div>
                    <div className=''>
                        {callAccepted && !callEnded ?
                            <video playsInline autoPlay ref={userVideo} className=' rounded-lg w-[100%] h-[100%]'></video> :
                            null}
                    </div>
                </div>

                {location.state.designation !== '0' && (!called ? <div className='fixed w-screen h-screen flex  justify-center  items-end bottom-[10%]'><div className='flex justify-center items-center'><img src='call.png' class="flex-shrink-0 h-[4rem] w-[4rem] rounded-full bg-gray-300 mr-3" onClick={() => {
                    callUser(id);
                    setcalled(true);
                }}></img><p className='text-white text-3xl'>{(location.state.name).toUpperCase()}</p></div></div> : null
                )}
                {location.state.designation !== '0' && (called && !callAccepted ? <div className='fixed w-screen h-screen flex  justify-center  items-center '><h1 className='text-white text-2xl'>
                    Waiting for User to Join...</h1></div> : null
                )}
                {(callAccepted && !callEnded ? <div className='fixed w-screen h-screen flex  justify-center  items-end bottom-[10%]'><div className='flex justify-center items-center'><img src='endcall.png' class="flex-shrink-0 h-[4rem] w-[4rem] rounded-full bg-gray-300 mr-3" onClick={() => {
                    leaveCall();

                }}></img><p className='text-white text-3xl'>End Call</p></div></div> : null
                )}


                {/* <input value={id} type='text' onChange={(e) => {
                    setid(e.target.value)
                }} >
                </input>
                <button onClick={() => {
                    callUser(id);
                }}>call</button> */}
                {receivingCall && <div className='fixed w-screen  flex justify-end '><div class="flex mt-5 space-x-3 max-w-xs">

                    <div>
                        <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                            <p class="text-sm">Incomming call from {caller.split('@')[0]}</p>
                        </div>
                        <button className='p-2 bg-blue-300 rounded m-1 hover:bg-green-700' onClick={() => {
                            answerCall();

                        }}>Accept</button>
                    </div>
                </div></div>}
            </div>
        </>
    )
}

export default Videocall