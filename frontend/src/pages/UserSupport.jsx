import React, { useEffect, useState, useRef, useContext } from 'react'
import axios from 'axios'
import Chatbot from './Chatbot/Chatbot'
import { VideoCallContext } from '../contexts/VideoCallContext'
import Peer from "simple-peer"
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
const UserSupport = (props) => {
    let { socket } = props;
    const location = useLocation();
    const navigate = useNavigate();
    const [req, setReq] = useState([]);
    const [currUser, setcurrUser] = useState({});
    const user = JSON.parse(localStorage.getItem('user'));
    const [room, setRoom] = useState('');
    //video call states
    const { callAccepted, setCallAccepted, stream, setStream, myVideo, userVideo, connectionRef, setName, setCallerSignal, setReceivingCall, setCaller } = useContext(VideoCallContext);
    // const [callAccepted, setCallAccepted] = useState(false)
    // const [stream, setStream] = useState()
    // const myVideo = useRef()
    // const userVideo = useRef()
    // const connectionRef = useRef()

    const joinRoom = (name, username) => {
        socket.emit("join_room", { room: `${name}@${username}`, username: currUser.username });//need to fix here (need the username of the current user!!);
    }
    const fetchReq = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/v1/support/getSupport", {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            console.log(res.data)
            setReq(res.data);

        } catch (e) {
            console.log(e);
        }
    }
    const fetchUser = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/v1/users/getCurrUser", {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            console.log(res.data);

            setcurrUser(res.data);
        } catch (e) {
            console.log(e);
        }
    }
    const handleReq = async (req_id, name, username, email, socket_id) => {
        if (req_id == '0') {
            try {
                const res = axios.post("http://localhost:5000/api/v1/support/delete", { email: email }, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })
                joinRoom(name, username);
                setRoom(`${name}@${username}`);

            } catch (e) {
                console.log(e);

            }
        } else if (req_id == '1') {
            joinRoom(name, username);

            socket.emit("getUsers");
            socket.on("users", (users) => {
                console.log("it workded!!");
                console.log(users);
                navigate('/videocall', { state: { id: users[username], designation: '1', name: name } });
            })



        }


    }
    useEffect(() => {
        fetchUser();
        // socket.on("callUser", (data) => {

        //     setReceivingCall(true)
        //     setCaller(data.from)
        //     setName(data.name)
        //     setCallerSignal(data.signal)
        // })
    }, [])
    // //video call functinalities
    // const callUser = (name, username) => {
    //     // socket.emit("join_room", `${name}@${username}`);
    //     navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
    //         // console.log("the support stream is", stream);
    //         setStream(stream)
    //         myVideo.current.srcObject = stream
    //     }).catch((e) => console.log(e));
    //     const peer = new Peer({
    //         initiator: true,
    //         trickle: false,
    //         stream: stream
    //     })
    //     peer.on("signal", (data) => {
    //         console.log("this is the support signal peer!!")
    //         socket.emit("callUser", {
    //             userToCall: "uo9FSxkeptLsESr4AAAJ",
    //             signalData: data,
    //             from: "w2VzHwSBQKIEq0DSAAAH",
    //             name: name
    //         })
    //     })
    //     peer.on("stream", (stream) => {
    //         console.log("this is the support ", stream);

    //         userVideo.current.srcObject = stream

    //     })
    //     socket.on("callAccepted", (signal) => {
    //         console.log("niceeeeee");
    //         // console.log("the support signal is ", signal);
    //         setCallAccepted(true)
    //         peer.signal(signal)
    //     })
    //     connectionRef.current = peer
    //     navigate('/videocall');
    // }

    useEffect(() => {
        fetchReq();
    }, [room])



    return (
        <>
            <Chatbot room={room} socket={socket} />


            <div className='w-[100vw] sm:items-center md:items-start mt-[1rem] flex justify-center sm:flex-col md:flex-row '>
                <div className='rounded sm:w-[90vh] md:w-[25%] m-[3px] bg-gray-400  p-[2rem] flex-col flex  items-center'>

                    <div class="flex-shrink-0 h-[8rem] w-[8rem] rounded-full bg-gray-300"></div>

                    <div class="grid grid-cols-2 gap-2 w-[100%] place-items-center text-xl  font-mono mt-[2rem]">
                        <div className='font-bold'>Name:</div>

                        <div>{currUser.name}</div>
                        <div className='font-bold'>Username:</div>

                        <div>{currUser.username}</div>
                        <div className='font-bold'>Email:</div>

                        <div>{currUser.email}</div>
                        <div className='font-bold'>Phone Number:</div>

                        <div>{currUser.phone_no}</div>
                    </div>





                </div>
                <div className='rounded flex sm:w-[90vh] md:w-[45%] bg-gray-400 m-[3px]  min-h-[40rem] p-[1rem] items-center flex-col'>
                    <h1 className=' text-3xl  font-mono font-bold mb-[2rem]'>
                        Customer Suport Requests
                    </h1>
                    <table class="table-auto text-gray-400 border-separate space-y-6 text-sm w-[90%]">
                        <thead class="bg-gray-800 text-gray-500">
                            <tr>
                                <th class="p-3">Name</th>
                                <th class="p-3 text-left">Phone Number</th>

                                <th class="p-3 text-left">Request</th>
                                <th class="p-3 text-left">Date & time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {req.map((x) => {
                                return <>
                                    <tr class="bg-gray-800">
                                        <td class="p-3">
                                            <div class="flex align-items-center">

                                                <div class="ml-3">
                                                    <div class="">{x.name}</div>
                                                    <div class="text-gray-500">{x.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="p-3">
                                            {x.phone_no}
                                        </td>

                                        <td class="p-3">
                                            {x.support_flag === '0' && <button class="bg-green-400 text-gray-50 min-w-[5rem] rounded-md p-[10px]" onClick={() => {
                                                handleReq(x.support_flag, x.name, x.username, x.email, x.socket_id)
                                            }}>Chat</button>}
                                            {x.support_flag === '1' && <button class="bg-yellow-400 text-gray-50  rounded-md p-[10px] min-w-[5rem]" onClick={() => {
                                                handleReq(x.support_flag, x.name, x.username, x.email, x.socket_id)
                                            }}>Video call</button>}
                                            {x.support_flag === '2' && <button class="bg-red-400 text-gray-50 min-w-[5rem] rounded-md p-[10px]" onClick={() => {
                                                handleReq(x.support_flag, x.name, x.username, x.email, x.socket_id)
                                            }}>Call</button>}

                                        </td>
                                        <td class="p-3">
                                            {x.date_added}

                                        </td>
                                    </tr>

                                </>
                            })}



                        </tbody>
                    </table>


                </div>
                <div className='rounded sm:w-[90vh] md:w-[25%] bg-gray-400 h  m-[3px] h-[20rem]   p-[1rem]'>
                    Imp details

                </div>
            </div>

        </>
    )
}

export default UserSupport