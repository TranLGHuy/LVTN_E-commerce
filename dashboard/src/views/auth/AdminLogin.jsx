import React, {useEffect, useState} from 'react'
import {PropagateLoader} from 'react-spinners'
import { useDispatch,useSelector } from "react-redux";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import { admin_login ,messageClear} from "../../store/Reducers/authReducer";
function AdminLogin() {
  const navigate = useNavigate()
    const dispatch = useDispatch()
    const {loader,errorMessage,successMessage} = useSelector(state=>state.auth)
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
      dispatch(admin_login(state))
    }
    const overrideStyle = {
      display : 'flex',
      margin: '0 auto',
      height : '24px',
      justifyContent : 'center',
      alignItems : 'center'
    }
    useEffect (()=>{
      if(errorMessage){
        toast.error(errorMessage)
        dispatch(messageClear())
      }
      if(successMessage){
        toast.success(successMessage)
        dispatch(messageClear())
        navigate('/')
      }
    },[errorMessage,successMessage])
    return (
      <div className='min-w-screen min-h-screen bg-[#36336a] flex justify-center items-center'>
        <div className='w-[350px] text-[#f0f9ff] p-2'>
          <div className='bg-[#51596b] p-4 rounded-md '>
              <div className='h-[70px] flex justify-center items-center'>
                  <div className='w-[180px] h-[50px]'>
                      <img className='w-full h-full' src='http://localhost:3000/images/Logo.png' alt='image'></img>
                  </div>
              </div>
              <form onSubmit={submit}>
                  <div className='flex flex-col w-full gap-1 mb-3'>
                      <label htmlFor='email'>Email</label>
                      <input onChange={inputHandle} value={state.email} className='px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden 'type='email' name='email' placeholder='Please enter your email' id='email' required />
                  </div>
                  <div className='flex flex-col w-full gap-1 mb-5'>
                      <label htmlFor='password'>Password</label>
                      <input onChange={inputHandle} value={state.password} className='px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden 'type='text' name='password' placeholder='Please enter your password' id='password' required />
                  </div>
                  <button disabled = { loader ? true : false } className='bg-blue-500 w-full hover:shadow-blue-500/50 hover:shadow-lg text-white  rounded-md px7 py-2 mb-3'>
                  {
                    loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Login'
                  }</button>
              </form>
          </div>
        </div>
      </div>
    )
}

export default AdminLogin
