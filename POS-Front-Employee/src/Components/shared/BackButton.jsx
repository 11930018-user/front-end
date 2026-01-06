import React from 'react';
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';


const BackButton = () => {
    const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)} className='bg-[#025cca] p-2 text-2xl font-bold rounded-full text-white'>
        <IoArrowBackSharp />
    </button>
  )
}   

export default BackButton