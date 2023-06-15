import React, { useEffect, useState } from 'react'
import axios from "axios";
const Chatstart = (props) => {
    const { setchat, chat } = props;
    const [questions, setQuestions] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchQuestionData = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/v1/questions/getQuestions", {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            setQuestions(res.data);
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {

        fetchQuestionData();
    }, []);
    return (
        <>
            {questions.length != 0 && <div class="flex w-full mt-5 space-x-3 max-w-xs">
                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                <div>
                    <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                        <p class="text-sm">Please select a Question</p>
                    </div>
                    <div className=' border border-black rounded mt-[2px]'>
                        {
                            questions.map((x) => {
                                return <>

                                    <button class="bg-gray-300 p-3 w-[100%]  border border-black" onClick={() => {
                                        setchat([...chat, { chat_flag: '0', msg: x.answer, room: "", date: ` ${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`, profile_image: "", username: "" }])

                                    }}>
                                        {x.question}
                                    </button >

                                </>
                            })
                        }
                        <button class="bg-gray-300 p-3 w-[100%]  border border-black" onClick={() => {
                            setchat([...chat, { chat_flag: '0', msg: null, room: "", date: ` ${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`, profile_image: "", username: "" }])

                        }}>
                            Need More Support?
                        </button >
                    </div>



                </div>
            </div >}
        </>
    )
}

export default Chatstart