import React, { useEffect } from 'react'
import Chatbot from './Chatbot/Chatbot'

import { Routes, Route, Navigate, useLocation } from "react-router-dom";

const User = (props) => {
    let { socket } = props;
    const location = useLocation();
    // useEffect(() => {
    //     if (location.pathname == '/user') {
    //         socket = io.connect("http://localhost:5000");
    //     }
    // }
    //     , [location.pathname])
    return (
        <>
            <Chatbot socket={socket} />
            <div>
                user
            </div>
        </>
    )
}

export default User