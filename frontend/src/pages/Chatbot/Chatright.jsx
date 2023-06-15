import React from 'react'

const Chatright = (props) => {
    const { msg, date } = props;
    return (
        <>
            <div class="flex w-full mt-5 space-x-3 max-w-xs ml-auto justify-end">
                <div>
                    <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                        <p class="text-sm">{msg}</p>
                    </div>
                    <span class="text-xs text-gray-500 leading-none">{date}</span>

                </div>
                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
            </div>
        </>
    )
}

export default Chatright