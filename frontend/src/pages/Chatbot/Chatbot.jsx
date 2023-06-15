import React, { useEffect, useState } from 'react'
import Chatleft from './Chatleft'
import Chatright from './Chatright'
import Chatstart from './Chatstart';
// import io from "socket.io-client"
import axios from 'axios';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

const Chatbot = (props) => {
    const { room, socket } = props;
    const [vis, setvis] = useState(0);
    const [chat, setchat] = useState([]);
    const [currentmsg, setCurrentmsg] = useState({ chat_flag: "", msg: "", room: "", date: "", profile_image: "", username: "" });
    const user = JSON.parse(localStorage.getItem('user'));
    const [currUser, setcurrUser] = useState({});


    const handleSend = async () => {
        let msg_data;
        if (currUser.designation == '1' || currUser.designation == '2') {
            msg_data = { ...currentmsg, username: currUser.username, date: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`, profile_image: currUser.profile_image, room: room, chat_flag: '0' };
        } else {
            msg_data = { ...currentmsg, username: currUser.username, date: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`, profile_image: currUser.profile_image, room: `${currUser.name}@${currUser.username}`, chat_flag: '0' };
        }
        setchat([...chat, {
            ...msg_data, chat_flag: '1'
        }]);
        console.log(chat);

        if (msg_data.room) {
            await socket.emit("send_message", msg_data);
        }




    }
    const joinRoom = (name, username) => {
        socket.emit("join_room", `${name}@${username}`);
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
    const handleSupport = async (support_flag) => {
        try {
            const res = await axios.post("http://localhost:5000/api/v1/support/addSupport", { support_flag: support_flag }, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            console.log(res);

            if (res.status != 200) {
                alert("Please try again!");
            } else {
                setchat([...chat, { chat_flag: '0', msg: "Our Customer support will contact you shortly.", room: "", date: ` ${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}` }])
                if (support_flag === '0') {
                    joinRoom(currUser.name, currUser.username);
                }
            }
        } catch (e) {
            console.log(e);
        }

    }
    useEffect(() => {
        fetchUser();

    }, [])
    useEffect(() => {
        console.log("nice");
        socket.on("receive_message", (msg_data) => {
            setchat([...chat, msg_data]);
        })


    }, [chat])




    return (
        <>
            <div className='  fixed flex justify-center items-center bottom-[2rem] right-[2rem] flex-col' >
                {vis == 1 && <div class="flex flex-col items-center justify-center h-[80vh] bg-gray-100 text-gray-800  w-[23rem] min-h-[30rem]">

                    {/* <!-- Component Start --> */}
                    <div class="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
                        <div class="flex flex-col flex-grow h-0 p-4 overflow-auto">
                            {currUser.designation === '0' && <Chatstart setchat={setchat} chat={chat} />}
                            {chat.map((x) => {
                                if (x.msg === null) {
                                    return <>
                                        <div class="flex w-full mt-5 space-x-3 max-w-xs">
                                            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                                            <div>
                                                <div class="">
                                                    <button id='0' className='p-2 bg-blue-300 rounded m-1 hover:bg-blue-700 ' onClick={(e) => {
                                                        handleSupport(e.target.id);
                                                    }}>Chat</button>
                                                    <button id='2' className='p-2 bg-blue-300 rounded m-1 hover:bg-blue-700 ' onClick={(e) => {
                                                        handleSupport(e.target.id);
                                                    }}>Call</button>
                                                    <button id='1' className='p-2 bg-blue-300 rounded m-1 hover:bg-blue-700 ' onClick={(e) => {
                                                        handleSupport(e.target.id);
                                                    }}>Video Call</button>
                                                </div>
                                                <span class="text-xs text-gray-500 leading-none">{x.date}</span>
                                            </div>
                                        </div>
                                    </>

                                } else {
                                    return <>
                                        {x.chat_flag == '0' ? <Chatleft msg={x.msg} date={x.date} /> : <Chatright msg={x.msg} date={x.date} />}
                                    </>
                                }

                            })}
                        </div>

                        <div class="bg-gray-300 p-4 flex-row">
                            <input class="items-center h-10 w-[80%]  rounded px-3 text-sm" type="text" placeholder="Type your message…" onChange={(e) => {
                                setCurrentmsg({ ...currentmsg, msg: e.target.value })
                            }} />
                            <button className='bg-blue-500 w-[20%] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => {
                                handleSend();

                            }}>Send</button>

                        </div>
                    </div>
                    {/* <!-- Component End  --> */}

                </div>}

                <div className='flex w-[100%] justify-end m-[1rem]'>
                    <button className='  flex-shrink-0 h-[4rem] w-[4rem] rounded-full bg-black' onClick={() => {
                        setvis(!vis)
                    }}></button>

                </div>


            </div>


        </>
    )
}

export default Chatbot