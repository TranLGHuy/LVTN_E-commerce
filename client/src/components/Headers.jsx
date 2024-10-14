import React,{ useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { IoIosMail } from "react-icons/io";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { FaHeadphonesAlt,FaFacebookSquare,FaTwitterSquare,FaGithubSquare,FaLinkedin,FaUserAlt,FaUserLock,FaListUl,FaHeart,FaShoppingCart } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux'
const Headers = () => {
    const {categories} = useSelector(state => state.home)
    const iconStyle = { fontSize: '20px' };
    const user = true
    const { pathname } = useLocation()
    const [showSidebar, setShowSidebar] = useState(true);
    const [categoryShow, setCategoryShow] = useState(true)
    const [searchValue, setSearchValue] = useState('')
    const [ setCategory] = useState('')
    const wishlist = 4
    const cart_product_count = 6
  return (
    <div className='w-full bg-white'>
        <div className='header-top bg-[#eeeeee] md-lg:hidden'>
            <div className='w-[85%] lg:w-[90%] mx-auto'>
                <div className='flex w-full justify-between items-center h-[50px] text-slate-500'>
                    <ul className='flex justify-start items-center gap-8'>
                        <li className='flex relative justify-center items-center gap-2 text-md after:absolute after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px]'>
                        <span style={iconStyle}><IoIosMail /></span>
                        <span>huyb2012210@gmail.com</span>
                        </li>
                        <span>ChickCyc E-commerce</span>
                    </ul>
                    <div>
                        <div className='flex justify-center items-center gap-10'>
                            <div className='flex justify-center items-center gap-4 '>
                                <a href="#" style={iconStyle}><FaFacebookSquare /></a>
                                <a href="#" style={iconStyle}><FaTwitterSquare /></a>
                                <a href="#" style={iconStyle}><FaGithubSquare /></a>
                                <a href="#" style={iconStyle}><FaLinkedin /></a>
                            </div>
                            <div className='flex group cursor-pointer text-slate-800 text-sm justify-center items-center gap-1 relative after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px] after:absolute before:absolute before:h-[18px] before:bg-[#afafaf] before:w-[1px] before:-left-[20px]'>
                                <img className='w-[20px] h-[20px]' src="http://localhost:3000/images/language.png" alt="" />
                                <span><MdKeyboardDoubleArrowDown /></span>
                                <ul className='absolute invisible transition-all to-12 rounded-sm duration-200 text-white p-2 w-[100px] flex flex-col gap-3 group-hover:visible group-hover:top-6 group-hover:bg-black z-10'>
                                    <li>Vietnamese</li>
                                    <li>English</li>
                                </ul>
                            </div>
                            {
                                user ? <Link className='flex cursor-pointer justify-center items-center gap-2 text-md font-semibold' to='/dashboard'>
                                    <span style={iconStyle}><FaUserAlt /></span>
                                    <span>Gia Huy</span>
                                </Link> : <Link to='/login' className='flex cursor-pointer justify-center items-center gap-2 text-md font-semibold'>
                                    <span style={iconStyle}><FaUserLock /></span>
                                    <span>Login</span>
                                </Link>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='w-white'>
            <div className='w-[85%] lg:w-[90%] mx-auto'>
                <div className='h-[80px] md-lg:h-[100px] flex justify-between items-center flex-wrap'>
                    <div className='md-lg:w-full w-3/12 md-lg:pt-4'>
                        <div className='flex justify-between items-center'>
                            <Link to='/'>
                                <img className='h-[90px] w-auto mt-2' src="http://localhost:3000/images/logo.png" alt="logo" />
                            </Link>
                            <div className='justify-center items-center w-[30px] h-[30px] bg-white text-slate-600 border border-slate-600 rounded-sm cursor-pointer lg:hidden md-lg:flex xl:hidden hidden' onClick={() => setShowSidebar(false)}>
                                <span style={iconStyle}><FaListUl /></span>
                            </div>
                        </div>
                    </div>
                    <div className='md-lg:w-full w-9/12'>
                        <div className='flex justify-between md-lg:justify-center items-center flex-wrap pl-8'>
                            <ul className='flex justify-start items-start gap-8 text-md font-bold uppercase md-lg:hidden'>
                                <li>
                                    <Link to='/' className={`p-2 block ${pathname === '/' ? 'text-[#7fad39]' : 'text-slate-600'}`}>Home</Link>
                                </li>
                                <li>
                                    <Link to='/shops' className={`p-2 block ${pathname === '/shop' ? 'text-[#7fad39]' : 'text-slate-600'}`}>Shop</Link>
                                </li>
                                <li>
                                    <Link className={`p-2 block ${pathname === '/blog' ? 'text-[#7fad39]' : 'text-slate-600'}`}>Blog</Link>
                                </li>
                                <li>
                                    <Link className={`p-2 block ${pathname === '/about' ? 'text-[#7fad39]' : 'text-slate-600'}`}>About</Link>
                                </li>
                                <li>
                                    <Link className={`p-2 block ${pathname === '/contact' ? 'text-[#7fad39]' : 'text-slate-600'}`}>Contact</Link>
                                </li>
                            </ul>
                            <div className='flex md-lg:hidden justify-center items-center gap-5'>
                                <div className='flex justify-center gap-5'>
                                    <div className='relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#e2e2e2]'>
                                    <span className='text-xl text-red-500'><FaHeart /></span>
                                    <div className='w-[20px] h-[20px] absolute bg-green-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px]'>
                                        {wishlist}
                                    </div>
                                </div>
                                <div  className='relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#e2e2e2]'>
                                    <Link to = '/cart' className='text-xl text-orange-500'><FaShoppingCart /></Link>
                                    <div className='w-[20px] h-[20px] absolute bg-green-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px]'>
                                        {cart_product_count}
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='hidden md-lg:block'>
            <div onClick={() => setShowSidebar(true)} className={`fixed duration-200 transition-all ${showSidebar ? 'invisible' : 'visible'} hidden md-lg:block w-screen h-screen bg-[rgba(0,0,0,0.5)] top-0 left-0 z-20`}>
            </div>
            <div className={`w-[300px] z-[9999] transition-all duration-200 fixed  ${showSidebar ? '-left-[300px]' : 'left-0'} top-0 overflow-y-auto bg-white h-screen py-6 px-8`}>
                <div className='flex justify-start flex-col gap-6'>
                    <Link to='/'>
                        <img className='h-[90px] w-auto mt-2' src="http://localhost:3000/images/logo.png" alt="logo" />
                    </Link>
                    <div className='flex justify-star items-center gap-10'>
                        <div className='flex group cursor-pointer text-slate-800 text-sm justify-center items-center gap-1 relative after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px] after:absolute'>
                            <img className='w-[20px] h-[20px]' src="http://localhost:3000/images/language.png" alt="" />
                            <span><MdKeyboardDoubleArrowDown /></span>
                            <ul className='absolute invisible transition-all to-12 rounded-sm duration-200 text-white p-2 w-[100px] flex flex-col gap-3 group-hover:visible group-hover:top-6 group-hover:bg-black z-10'>
                                <li>Vietnamese</li>
                                <li>English</li>
                            </ul>
                        </div>
                        {
                            user ? <Link className='flex cursor-pointer justify-center items-center gap-2 text-sm' to='/dashboard'>
                                <span style={iconStyle}><FaUserAlt /></span>
                                <span>Gia Huy</span>
                            </Link> : <div className='flex cursor-pointer justify-center items-center gap-2 text-sm'>
                                <span style={iconStyle}><FaUserLock /></span>
                                <span>Login</span>
                            </div>
                        }
                    </div>
                    <ul className='flex flex-col justify-start items-start text-md font-semibold uppercase'>
                        <li>
                            <Link className={`py-2 block ${pathname === '/' ? 'text-[#7fad39]' : 'text-slate-600'}`}>Home</Link>
                        </li>
                        <li>
                            <Link to={'/shops'} className={`py-2 block ${pathname === '/shops' ? 'text-[#7fad39]' : 'text-slate-600'}`}>Shop</Link>
                        </li>
                        <li>
                            <Link className={`py-2 block ${pathname === '/blog' ? 'text-[#7fad39]' : 'text-slate-600'}`}>Blog</Link>
                        </li>
                        <li>
                            <Link className={`py-2 block ${pathname === '/about' ? 'text-[#7fad39]' : 'text-slate-600'}`}>About</Link>
                        </li>
                        <li>
                            <Link className={`py-2 block ${pathname === '/contact' ? 'text-[#7fad39]' : 'text-slate-600'}`}>Contact</Link>
                        </li>
                    </ul>
                    <div className='flex justify-start  items-center gap-4'>
                        <a href="#" style={iconStyle}><FaFacebookSquare /></a>
                        <a href="#" style={iconStyle}><FaTwitterSquare /></a>
                        <a href="#" style={iconStyle}><FaGithubSquare /></a>
                        <a href="#" style={iconStyle}><FaLinkedin /></a>     
                    </div>
                    <div className='w-full flex justify-end md-lg:justify-start gap-3 items-center'>
                        <div className='w-[48px] h-[48px] rounded-full flex bg-[#f5f5f5] justify-center items-center'>
                            <span><FaHeadphonesAlt /></span>
                        </div>
                        <div className='flex justify-end flex-col gap-1'>
                            <h2 className='text-sm font-medium text-slate-700'>0939235461</h2>
                            <span className='text-xs text-[#ce4848] font-bold'>Support 24/7</span>
                        </div>
                    </div>
                    <ul className='flex flex-col justify-start items-start gap-3 text-[#1c1c1c]'>
                        <li className='flex justify-start items-center gap-2  text-md'>
                            <span style={iconStyle}>< IoIosMail/></span>
                            <span>huyb2012210@gmail.com</span>
                        </li>
                        <span className='text-md'>ChickCyc E-commerce</span>
                    </ul>
                </div>
            </div>
        </div>
        <div className='w-[85%] lg:w-[90%] mx-auto mt-5'>
            <div className='flex w-full flex-wrap md-lg:gap-8'>
                <div className='w-3/12 md-lg:w-full'>
                    <div className='bg-white relative'>
                        <div onClick={() => setCategoryShow(!categoryShow)} className='h-[50px] bg-violet-400 text-white flex justify-center md-lg:justify-between md-lg:px-6 items-center gap-3 font-bold text-md cursor-pointer'>
                            <div className="flex justify-center items-center gap-3">
                                <span><FaListUl /></span>
                                <span>All Category</span>
                            </div>
                            <span className='pt-1'><MdKeyboardDoubleArrowDown /></span>
                        </div>
                        <div className={`${categoryShow ? 'h-0' : 'h-[400px]'} overflow-hidden transition-all md-lg:relative duration-500 absolute z-[99999] bg-white w-full border-x`}>
                            <ul className='py-2 text-slate-600 font-medium h-full overflow-auto'>
                                {
                                    categories.map((c, i) => {
                                        return (
                                            <li key={i} className='flex justify-start items-center gap-2 px-[24px] py-[6px]'>
                                                <img src={c.image} className='w-[30px] h-[30px] rounded-full overflow-hidden' alt={c.name} />
                                                <Link to={`/products?category=${c.name}`} className='text-sm block'>{c.name}</Link>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='w-9/12 pl-8 md-lg:pl-0 md-lg:w-full'>
                    <div className='flex flex-wrap w-full justify-between items-center md-lg:gap-6'>
                        <div className='w-8/12 md-lg:w-full'>
                            <div className='flex border h-[50px] items-center relative gap-5'>
                                <div className='relative after:absolute after:h-[25px] after:w-[1px] after:bg-[#afafaf] after:-right-[15px] md:hidden'>
                                    <select onChange={(e) => setCategory(e.target.value)} className='w-[150px] text-slate-600 font-semibold bg-transparent px-2 h-full outline-0 border-none' name="" id="">
                                        <option value="">Select category</option>
                                        {
                                            categories.map((c, i) => <option key={i} value={c}>{c.name}</option>)
                                        }
                                    </select>
                                </div>
                                <input className='w-full relative bg-transparent text-slate-500 outline-0 px-3 h-full' onChange={(e) => setSearchValue(e.target.value)} type="text" name="" id="" placeholder='What do you need' />
                                <button className='bg-violet-400 right-0 absolute px-8 h-full font-semibold uppercase text-white'>Search</button>
                            </div>
                        </div>
                        <div className='w-4/12 block md-lg:hidden pl-2 md-lg:w-full md-lg:pl-0'>
                            <div className='w-full flex justify-end md-lg:justify-start gap-3 items-center'>
                                <div className='w-[48px] h-[48px] rounded-full flex bg-[#f5f5f5] justify-center items-center'>
                                    <span style={iconStyle}><FaHeadphonesAlt /></span>
                                </div>
                                <div className='flex justify-end flex-col gap-1'>
                                    <h2 className='text-md font-medium text-slate-700'>0939235461</h2>
                                    <span className='text-xs text-[#ce4848] font-bold'>Support 24/7</span>
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

export default Headers
