import React, {useState} from 'react'

import { Link } from "react-router-dom";
import { FaFacebook, FaGoogle } from "react-icons/fa";

function Login() {
    const [state,setState] = useState({
        email : "",
        password: '',
    })
    const inputHandle = (e) => {
      setState({
        ...state,
        [e.target.name] : e.target.value
      })
    }
    const submit = (e) => {
      e.preventDefault()
      console.log(state)
    }
  return (
    <div className='min-w-screen min-h-screen bg-[#36336a] flex justify-center items-center'>
      <div className='w-[350px] text-[#f0f9ff] p-2'>
        <div className='bg-[#51596b] p-4 rounded-md '>
            <h2 className='text-xl mb-3 font-bold'>Welcome to e-commerce</h2>
            <p className='text-sm mb-3'>Please login your account and start your business</p>
            <form onSubmit={submit}>
                <div className='flex flex-col w-full gap-1 mb-3'>
                    <label htmlFor='email'>Email</label>
                    <input onChange={inputHandle} value={state.email} className='px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden 'type='email' name='email' placeholder='Please enter your email' id='email' required />
                </div>
                <div className='flex flex-col w-full gap-1 mb-5'>
                    <label htmlFor='password'>Password</label>
                    <input onChange={inputHandle} value={state.password} className='px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden 'type='text' name='password' placeholder='Please enter your password' id='password' required />
                </div>
                <button className='bg-blue-500 w-full hover:shadow-blue-500/50 hover:shadow-lg text-white  rounded-md px7 py-2 mb-3'>Sign In</button>
                <div className='flex items-center mb-3 gap-3 justify-center'>
                    <p>Already have account? <Link to='/register'>Signup here</Link></p>
                </div>
                <div className='w-full flex justify-center items-center mb-3'>
                    <div className='w-[45%] bg-slate-700 h-[1px]'></div>
                    <div className='w-[10%] flex justify-center items-center'>
                        <span className='pb-1'>Or</span>
                    </div>
                    <div className='w-[45%] bg-slate-700 h-[1px]'></div>
                </div>
                <div className='flex justify-center items-center gap-3'>
                    <div className='w-[35px] h-[35px] flex rounded-md bg-orange-700 shadow-lg hover:shadow-orange-700 justify-center cursor-pointer items-center overflow-hidden'>
                        <span><FaGoogle/></span>
                    </div>
                    <div className='w-[35px] h-[35px] flex rounded-md bg-blue-700 shadow-lg hover:shadow-blue-700 justify-center cursor-pointer items-center overflow-hidden'>
                        <span><FaFacebook/></span>
                    </div>
                </div>
            </form>
        </div>
      </div>
    </div>
  )
}

export default Login
