import React, { useEffect } from 'react'
import Chatbot from './Chatbot/Chatbot'

import { useLocation } from "react-router-dom";

const User = (props) => {
    let { socket } = props;
    const location = useLocation();
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