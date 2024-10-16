import React, { useEffect, useState } from 'react'
import FadeLoader from 'react-spinners/FadeLoader'
import Headers from '../components/Headers'
import Footer from '../components/Footer'
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Link,useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { customer_register,messageClear } from '../store/reducers/authReducer'
const Register = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loader, successMessage, errorMessage ,userInfo} = useSelector(state => state.auth)
    const [state, setState] = useState({
        name: '',
        email: '',
        password: ''
    })
    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    const register = (e) => {
        e.preventDefault()
        dispatch(customer_register(state))
    }
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
        if(errorMessage){
            toast.error(errorMessage)
            dispatch(messageClear())
        }
        if(userInfo){
            navigate('/')
        }
    }, [successMessage,errorMessage])
  return (
    <div>
        {
            loader && <div className='w-screen h-screen flex justify-center items-center fixed left-0 top-0 bg-[#38303033] z-[999]'>
                <FadeLoader />
            </div>
        }
        <Headers/>
        <div className='bg-slate-200 mt-4'>
            <div className='w-full justify-center items-center p-10'>
                <div className='grid grid-cols-2 w-[60%] mx-auto bg-white rounded-md'>
                    <div className='px-8 py-8'>
                        <h2 className='text-center w-full text-xl text-slate-600 font-bold'>Register</h2>
                        <div>
                            <form onSubmit={register} className='text-slate-600'>
                                <div className='flex flex-col gap-1 mb-2'>
                                    <label htmlFor="name">Name</label>
                                    <input onChange={inputHandle} value={state.name} type="text" className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md' id='name' name='name' placeholder='name' required />
                                </div>
                                <div className='flex flex-col gap-1 mb-2'>
                                    <label htmlFor="email">Email</label>
                                    <input onChange={inputHandle} value={state.email} type="email" className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md' id='email' name='email' placeholder='email' required />
                                </div>
                                <div className='flex flex-col gap-1 mb-4'>
                                    <label htmlFor="password">Password</label>
                                    <input onChange={inputHandle} value={state.password} type="password" className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md' id='password' name='password' placeholder='password' required />
                                </div>
                                <button className='px-8 w-full py-2 bg-purple-500 shadow-lg hover:shadow-indigo-500/30 text-white rounded-md'>Register</button>
                            </form>
                            <div className='flex justify-center items-center py-2'>
                                <div className='h-[1px] bg-slate-300 w-[95%]'></div>
                                <span className='px-3 text-slate-600'>or</span>
                                <div className='h-[1px] bg-slate-300 w-[95%]'></div>
                            </div>
                            <button className='px-8 w-full py-2 bg-indigo-500 shadow hover:shadow-indigo-500/30 text-white rounded-md flex justify-center items-center gap-2 mb-3'>
                                <span><FaFacebook /></span>
                                <span>Login with Facebook</span>
                            </button>
                            <button className='px-8 w-full py-2 bg-orange-500 shadow hover:shadow-orange-500/30 text-white rounded-md flex justify-center items-center gap-2 mb-3'>
                                <span><FaGoogle /></span>
                                <span>Login with Google</span>
                            </button>
                        </div>
                        <div className='text-center text-slate-600 pt-1'>
                            <p>You have no account ? <Link className='text-blue-500' to='/login'>Login</Link></p>
                        </div>
                        <div className='text-center text-slate-600 pt-1'>
                            <p> <a target='_black' className='text-blue-500' href='http://localhost:3001/login'>Login</a> seller account</p>
                        </div>
                </div>
                <div className='w-full h-full py-4 pr-4'>
                    <img className='w-full h-[85%]' src="http://localhost:3000/images/2.gif" alt="" />
                </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default Register