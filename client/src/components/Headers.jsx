import React from 'react'
import { IoIosMail } from "react-icons/io";
import { FaFacebookSquare,FaTwitterSquare,FaGithubSquare,FaLinkedin } from "react-icons/fa";
const Headers = () => {
  return (
    <div className='w-full bg-white'>
        <div className='header-top bg-[#eeeeee] md-lg:hidden'>
            <div className='w-[85%] lg:w-[90%] mx-auto'>
                <div className='flex w-full justify-between items-center h-[50px] text-slate-500'>
                    <ul className='flex justify-start items-center gap-8'>
                        <li className='flex relative justify-center items-center gap-2 text-sm after:absolute after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px]'>
                        <span><IoIosMail /></span>
                        <span>huyb2012210@gmail.com</span>
                        </li>
                        <span>ChickCyc Ecommerce</span>
                    </ul>
                    <div>
                        <div className='flex justify-center items-center gap-10'>
                            <div className='flex justify-center items-center gap-4'>
                                <a href="#" className=''><FaFacebookSquare /></a>
                                <a href="#"><FaTwitterSquare /></a>
                                <a href="#"><FaGithubSquare /></a>
                                <a href="#"><FaLinkedin /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Headers
