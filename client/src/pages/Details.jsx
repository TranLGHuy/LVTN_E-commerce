import React, { useEffect, useState } from 'react'
import Headers from '../components/Headers'
import Footer from '../components/Footer'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import 'swiper/css/pagination'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { Pagination } from 'swiper'
import Ratings from '../components/Ratings'
import { FaFacebookSquare,FaTwitterSquare,FaGithubSquare,FaLinkedin,FaHeart } from "react-icons/fa";
const Details = () => {
    const [state, setState] = useState('reviews')
    const [image, setImage] = useState('')
    const images = [1,2,3,4,5,6,7]
    const discount = 5
    const stock = 4
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 4
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 3
        }
    }
  return (
    <div>
        <Headers />
            <div className='bg-[url("http://localhost:3000/images/banner/order.jpg")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
                <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
                    <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
                        <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
                            <h2 className='text-3xl font-bold'>ChickCyc.Shop</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className='bg-slate-100 py-5 mb-5'>
                <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
                    <div className='flex justify-start items-center text-md text-slate-600 w-full'>
                        <Link to='/'>Home</Link>
                        <span className='pt-1'><MdOutlineKeyboardArrowRight /></span>
                        <Link to='/'>Sports</Link>
                        <span className='pt-1'><MdOutlineKeyboardArrowRight /></span>
                        <span>Ao Thun trang</span>
                    </div>
                </div>
            </div>
            <section>
                <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto pb-16'>
                    <div className='grid grid-cols-2 md-lg:grid-cols-1 gap-8'>
                        <div>
                            <div className='p-5 border'>
                                <img className='h-[500px] w-full' src={image ? `http://localhost:3000/images/product/${image}.jpg`: `http://localhost:3000/images/product/${images[0]}.jpg`} alt="" />
                            </div>
                            <div className='py-3'>
                                {
                                    images && <Carousel
                                    autoPlay={true}
                                    infinite={true}
                                    responsive={responsive}
                                    transitionDuration={500}
                                    >
                                        {
                                            images.map((img, i) => {
                                                return (
                                                    <div key={i} onClick={() => setImage(img)}>
                                                        <img className='h-[120px] cursor-pointer' src={`http://localhost:3000/images/product/${img}.jpg`} alt="" />
                                                    </div>
                                                )
                                            })
                                        }
                                    </Carousel>
                                }
                            </div>
                        </div>
                        <div className='flex flex-col gap-5'>
                            <div className='text-3xl text-slate-600 font-bold'>
                                <h2>Ao Thun Trang Nam</h2>
                            </div>
                            <div className='flex justify-start items-center gap-4'>
                                <div className='flex text-xl'>
                                    <Ratings ratings={4.5} />
                                </div>
                                <span className='text-green-500'>(20 reviews)</span>
                            </div>
                            <div className='text-2xl text-red-500 font-bold flex gap-3'>
                                {
                                   discount !== 0 ? <>
                                        <h2 className='line-through'>$100</h2>
                                        <h2>${100 - Math.floor((100 * 5) / 100)} (-5%)</h2>
                                    </> : <h2>Price : $95</h2>
                                }
                            </div>
                            <div className='text-slate-600'>
                                <p>Chiếc áo thun trắng nam này là món đồ cơ bản không thể thiếu trong tủ quần áo của mọi chàng trai. Được làm từ 100% cotton mềm mại, thoáng khí, mang lại cảm giác dễ chịu suốt cả ngày. Thiết kế cổ tròn, tay ngắn, dễ dàng phối với nhiều trang phục khác nhau, từ quần jean đến shorts. Với màu trắng tinh khôi, áo thun này phù hợp cho cả những dịp thường ngày và đi chơi. Size XL.</p>
                            </div>
                            <div className='flex gap-3 pb-10 border-b'>
                                {
                                    stock ? <>
                                        <div className='flex bg-slate-200 h-[50px] justify-center items-center text-xl'>
                                            <div  className='px-6 cursor-pointer'>-</div>
                                            <div className='px-5'>1</div>
                                            <div  className='px-6 cursor-pointer'>+</div>
                                        </div>
                                        <div>
                                            <button  className='px-8 py-3 h-[50px] cursor-pointer hover:shadow-lg hover:shadow-purple-500/40 bg-purple-500 text-white'>Add To Card</button>
                                        </div>
                                    </> : ''
                                }
                                <div>
                                    <div className='h-[50px] w-[50px] flex justify-center items-center cursor-pointer hover:shadow-lg hover:shadow-red-500/40 bg-red-500 text-white'>
                                        <FaHeart />
                                    </div>
                                </div>
                            </div>
                            <div className='flex py-5 gap-5'>
                                <div className='w-[150px] text-black font-bold text-xl flex flex-col gap-5'>
                                    <span>Availability</span>
                                    <span>Share on</span>
                                </div>
                                <div className='flex flex-col gap-5'>
                                    <span className={`text-${stock ? 'green' : 'red'}-500`}>
                                        {stock ? `In Stock(${stock})` : 'Out of Stock'}
                                    </span>
                                    <ul className='flex justify-start items-center gap-3'>
                                        <li>
                                            <a className='w-[38px] h-[38px] hover:bg-[#7fad39] hover:text-white flex justify-center items-center bg-indigo-500 rounded-full text-white' href="#"><FaFacebookSquare /></a>
                                        </li>
                                        <li>
                                            <a className='w-[38px] h-[38px] hover:bg-[#7fad39] hover:text-white flex justify-center items-center bg-cyan-500 rounded-full text-white' href="#"><FaTwitterSquare /></a>
                                        </li>
                                        <li>
                                            <a className='w-[38px] h-[38px] hover:bg-[#7fad39] hover:text-white flex justify-center items-center bg-purple-500 rounded-full text-white' href="#"><FaLinkedin /></a>
                                        </li>
                                        <li>
                                            <a className='w-[38px] h-[38px] hover:bg-[#7fad39] hover:text-white flex justify-center items-center bg-blue-500 rounded-full text-white' href="#"><FaGithubSquare /></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className='flex gap-3'>
                                {
                                    stock ? <button className='px-8 py-3 h-[50px] cursor-pointer hover:shadow-lg hover:shadow-emerald-500/40 bg-emerald-500 text-white'>Buy Now</button> : ""
                                }
                                <Link  className='px-8 py-3 h-[50px] cursor-pointer hover:shadow-lg hover:shadow-lime-500/40 bg-lime-500 text-white block'>Chat Seller</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto pb-16'>
                    <div className='flex flex-wrap'>
                        <div className='w-[72%] md-lg:w-full'>
                            <div className='pr-4 md-lg:pr-0'>
                                <div className='grid grid-cols-2'>
                                    <button onClick={() => setState('reviews')} className={`py-1 hover:text-white px-5 hover:bg-green-500 ${state === 'reviews' ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-700'} rounded-sm`}>Reviews</button>
                                    <button onClick={() => setState('description')} className={`py-1 px-5 hover:text-white hover:bg-green-500 ${state === 'description' ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-700'} rounded-sm`}>Description</button>
                                </div>
                                <div>
                                    {
                                        state === 'reviews' ? 'reviews' : 'description'
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='w-[28%] md-lg:w-full'>
                            <div className='pl-4 md-lg:pl-0'>
                                <div className='px-3 py-2 text-slate-600 bg-slate-200'>
                                    <h2> From GiaHuyShop</h2>
                                </div>
                                <div className='flex flex-col gap-5 mt-3 border p-3'>
                                    {
                                        [1,2,3].map((p, i) => {
                                            return (
                                                <Link className='block'>
                                                    <div className='relative h-[270px]'>
                                                        <img className='w-full h-full' src={`http://localhost:3000/images/product/${p}.jpg`} />
                                                        {
                                                            discount !== 0 && <div className='flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2'>{discount}%</div>
                                                        }
                                                    </div>
                                                    <h2 className='text-slate-600 py-1'>Quan Jeans</h2>
                                                    <div className='flex gap-2'>
                                                        <h2 className='text-[#6699ff] text-lg font-bold'>$50</h2>
                                                        <div className='flex items-center gap-2'>
                                                            <Ratings ratings={4} />
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    </div>
  )
}

export default Details
