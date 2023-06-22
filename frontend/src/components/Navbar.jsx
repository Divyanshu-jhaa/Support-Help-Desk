import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
export const Navbar = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className='fixed w-screen h-[4rem]  bg-[#28282B] flex  items-center'>
                <FiLogOut onClick={() => {
                    localStorage.removeItem('user');
                    navigate('/authentication');
                }} className='absolute right-[2rem]  text-white text-3xl' >
                </FiLogOut>
            </div>
        </>
    )
}
