import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Chatbot from './Chatbot/Chatbot'

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
const UserSupport = (props) => {
    let { socket } = props;
    const location = useLocation();
    const [req, setReq] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const [room, setRoom] = useState('');
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
    const handleReq = async (req_id, name, username, email) => {
        if (req_id == '0') {
            try {
                const res = axios.post("http://localhost:5000/api/v1/support/delete", { email: email }, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })
                socket.emit("join_room", `${name}@${username}`);
                setRoom(`${name}@${username}`);

            } catch (e) {
                console.log(e);

            }
        }


    }
    useEffect(() => {
        fetchReq();
    }, [room])
    // useEffect(() => {
    //     if (location.pathname == '/usersupport') {
    //         socket = io.connect("http://localhost:5000");
    //     }
    // }, [location.pathname])


    return (
        <>
            <Chatbot room={room} socket={socket} />


            <div className='w-[100vw] sm:items-center md:items-start mt-[1rem] flex justify-center sm:flex-col md:flex-row '>
                <div className='rounded sm:w-[90vh] md:w-[25%] m-[3px] bg-gray-400 h-[30rem] p-[1rem]'>
                    Profile


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
                                                handleReq(x.support_flag, x.name, x.username, x.email)
                                            }}>Chat</button>}
                                            {x.support_flag === '1' && <button class="bg-yellow-400 text-gray-50  rounded-md p-[10px] min-w-[5rem]" onClick={() => {
                                                handleReq(x.support_flag, x.name, x.username, x.email)
                                            }}>Video call</button>}
                                            {x.support_flag === '2' && <button class="bg-red-400 text-gray-50 min-w-[5rem] rounded-md p-[10px]" onClick={() => {
                                                handleReq(x.support_flag, x.name, x.username, x.email)
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