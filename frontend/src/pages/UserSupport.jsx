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
        try {
            const res = axios.post("http://localhost:5000/api/v1/support/delete", { email: email, support_flag: req_id }, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })


        } catch (e) {
            console.log(e);

        }
        if (req_id == '0') {
            joinRoom(name, username);
            setRoom(`${name}@${username}`);

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
        socket.on("refreshSupportReq", () => {
            console.log("refreshed!!")
            fetchReq();
        })

        fetchUser();
    }, [])


    useEffect(() => {
        fetchReq();
    }, [room])



    return (
        <>
            <Chatbot room={room} socket={socket} />
            <div className='w-screen min-h-screen  bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800'>
                <div className=' items-center md:items-start  flex justify-center flex-col md:flex-row'>
                    <div className='rounded-xl w-[90vh] md:w-[25%] m-[3px]   bg-gray-100  p-[2rem] flex-col flex  items-center  mt-[5rem] '>

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
                    <div className='rounded-xl   mt-[5rem] flex w-[90vh] md:w-[45%]  bg-gray-100 m-[3px]  min-h-[40rem] p-[1rem] items-center flex-col'>
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
                    <div className='rounded-xl flex justify-center w-[90vh] md:w-[25%]  bg-gray-100 h  m-[3px] h-[20rem]    mt-[5rem]  p-[1rem] '>
                        <h1 className='text-3xl  font-mono font-bold'>Current Traffic</h1>


                    </div>
                </div>
            </div>




        </>
    )
}

export default UserSupport