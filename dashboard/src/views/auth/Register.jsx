import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useDispatch,useSelector } from "react-redux";
import {PropagateLoader} from 'react-spinners'
import { overrideStyle } from '../../utils/utils'
import { messageClear, seller_register } from '../../store/Reducers/authReducer'
function Register() {
    const dispatch = useDispatch()
    const { loader, errorMessage, successMessage } = useSelector(state => state.auth)

    const [state,setState] = useState({
        name : '',
        email: "",
        password: '',
    })
    const inputHandle = (e) => {
      setState({
        ...state,
        [e.target.name] : e.target.value
      })
    }
    const submit = (e) => {
      e.preventDefault();
      dispatch(seller_register(state))
    }
  return (
    <div className='min-w-screen min-h-screen bg-[#36336a] flex justify-center items-center'>
      <div className='w-[350px] text-[#f0f9ff] p-2'>
        <div className='bg-[#51596b] p-4 rounded-md '>
            <h2 className='text-xl mb-3 font-bold'>Welcome to e-commerce</h2>
            <p className='text-sm mb-3'>Please register your account and start your business</p>
            <form onSubmit={submit}>
                <div className='flex flex-col w-full gap-1 mb-3'>
                    <label htmlFor='name'>Name</label>
                    <input onChange={inputHandle}  value={state.name} className='px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden 'type='text' name='name' placeholder='Please enter your name' id='name' required />
                </div>
                <div onChange={inputHandle}  value={state.email} className='flex flex-col w-full gap-1 mb-3'>
                    <label htmlFor='email'>Email</label>
                    <input className='px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden 'type='email' name='email' placeholder='Please enter your email' id='email' required />
                </div>
                <div onChange={inputHandle}  value={state.password} className='flex flex-col w-full gap-1 mb-3'>
                    <label htmlFor='password'>Password</label>
                    <input className='px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden 'type='text' name='password' placeholder='Please enter your password' id='password' required />
                </div>
                <div className='flex items-center w-full gap-1 mb-3'>
                    <input className='w-5 h-5 text-blue-600 overflow-hidden bg-gray-100 rounded border-gray-300 focus:ring-blue-500 'type='checkbox' name='checkbox'id='checkbox' required />
                    <label htmlFor='checkbox'> I agree to privacy policy && terms</label>
                </div>
                <button disabled = { loader ? true : false } className='bg-blue-500 w-full hover:shadow-blue-500/50 hover:shadow-lg text-white  rounded-md px7 py-2 mb-3'>
                  {
                    loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Sign Up'
                  }</button>
                <div className='flex items-center mb-3 gap-3 justify-center'>
                    <p>Already have account? <Link to='/login'>Signin here</Link></p>
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

export default Register
