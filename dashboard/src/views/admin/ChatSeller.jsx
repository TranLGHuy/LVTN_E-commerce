import React,{useState} from 'react'
import { GrClose } from "react-icons/gr";
const ChatSeller = () => {
    const [show,setShow] = useState(false)
  return (
    <div className='px-2 lg:px-7 py-5'>
        <div className='w-full bg-[#283046] px-4 py-4 rounded-md h-[calc(100vh-140px)]'>
            <div className='flex w-full h-full relative'>
                <div className={`w-[280px] h-full absolute z-10 ${show ? '-left-[16px]':'-[335px]'} md:left-0 md:relative transition-all` }>
                    <div className='w-full h-[calc(100vh-177px)] bg-[#252b3b] md:bg-transparent overflow-y-auto'>
                        <div className='flex text-xl justify-between items-center p-4 md:p-0 md:px-3 md:pb-3 text-white'>
                            <h2>Sellers</h2>
                            <span onClick={() => setShow(true)} className='block cursor-pointer md:hidden'><GrClose/></span>
                        </div>
                        <div className={`h-[60px] flex justify-start gap-2 items-center text-white px-2 rounded-sm py-2 cursor-pointer`}>
                            <div className='relative'>
                                <img className='w-[40px] h-[40px] border-white border-2 max-w-[40px] p-[2px] rounded-full' src="http://localhost:3000/images/admin.jpg" alt="" />
                                <div className='w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0'></div>
                            </div>
                            <div className='flex justify-center items-start flex-col w-full'>
                                <div className='flex justify-between items-center w-full'>
                                    <h2 className='text-base font-semibold'>Gia Huy</h2>
                                </div>
                            </div>
                        </div>
                        <div className={`h-[60px] flex justify-start gap-2 items-center text-white px-2 rounded-sm py-2 cursor-pointer`}>
                            <div className='relative'>
                                <img className='w-[40px] h-[40px] border-white border-2 max-w-[40px] p-[2px] rounded-full' src="http://localhost:3000/images/admin.jpg" alt="" />
                                <div className='w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0'></div>
                            </div>
                            <div className='flex justify-center items-start flex-col w-full'>
                                <div className='flex justify-between items-center w-full'>
                                    <h2 className='text-base font-semibold'>Gia Huy</h2>
                                </div>
                            </div>
                        </div>
                        <div className={`h-[60px] flex justify-start gap-2 items-center text-white px-2 rounded-sm py-2 cursor-pointer`}>
                            <div className='relative'>
                                <img className='w-[40px] h-[40px] border-white border-2 max-w-[40px] p-[2px] rounded-full' src="http://localhost:3000/images/admin.jpg" alt="" />
                                <div className='w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0'></div>
                            </div>
                            <div className='flex justify-center items-start flex-col w-full'>
                                <div className='flex justify-between items-center w-full'>
                                    <h2 className='text-base font-semibold'>Gia Huy</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    </div>
  )
}

export default ChatSeller
