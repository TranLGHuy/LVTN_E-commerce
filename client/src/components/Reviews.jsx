import React, { useState, useEffect } from 'react'
import Ratings from './Ratings'
import Pagination from './Pagination'
import { AiFillStar } from 'react-icons/ai'
import RatingReact from 'react-rating'
import { CiStar } from 'react-icons/ci'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import RatingTemp from './RatingTemp'

const Reviews = () => {
    const userInfo  = {}

    const [pageNumber, setPageNumber] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [rat, setRat] = useState('')
    const totalReview = 22
    return (
        <div className='mt-8'>
            <div className='flex gap-10 md:flex-col'>
                <div className='flex flex-col gap-2 justify-start items-start py-4'>
                    <div>
                        <span className='text-6xl font-semibold'>4.5</span>
                        <span className='text-3xl font-semibold text-slate-600'>/5</span>
                    </div>
                    <div className='flex text-4xl'>
                        <Ratings ratings={4.5} />
                    </div>
                    <p className='text-sm text-slate-600'>22 Reviews</p>
                </div>
                <div className='flex gap-2 flex-col py-4'>
                    <div className='flex justify-start items-center gap-5'>
                        <div className='text-md flex gap-1 w-[93px]'>
                            <RatingTemp rating={5} />
                        </div>
                        <div className='w-[200px] h-[14px] bg-slate-200 relative'>
                            <div className='h-full bg-[#EDBB0E] w-[50%]'></div>
                        </div>
                        <p className='text-sm text-slate-600 w-[0%]'>25</p>
                    </div>
                    <div className='flex justify-start items-center gap-5'>
                        <div className='text-md flex gap-1 w-[93px]'>
                            <RatingTemp rating={4} />
                        </div>
                        <div className='w-[200px] h-[14px] bg-slate-200 relative'>
                            <div className='h-full bg-[#EDBB0E] w-[30%]'></div>
                        </div>
                        <p className='text-sm text-slate-600 w-[0%]'>15</p>
                    </div>
                    <div className='flex justify-start items-center gap-5'>
                        <div className='text-md flex gap-1 w-[93px]'>
                            <RatingTemp rating={3} />
                        </div>
                        <div className='w-[200px] h-[14px] bg-slate-200 relative'>
                            <div className='h-full bg-[#EDBB0E] w-[10%]'></div>
                        </div>
                        <p className='text-sm text-slate-600 w-[0%]'>5</p>
                    </div>
                    <div className='flex justify-start items-center gap-5'>
                        <div className='text-md flex gap-1 w-[93px]'>
                            <RatingTemp rating={2} />
                        </div>
                        <div className='w-[200px] h-[14px] bg-slate-200 relative'>
                            <div className='h-full bg-[#EDBB0E] w-[10%]'></div>
                        </div>
                        <p className='text-sm text-slate-600 w-[0%]'>5</p>
                    </div>
                    <div className='flex justify-start items-center gap-5'>
                        <div className='text-md flex gap-1 w-[93px]'>
                            <RatingTemp rating={1} />
                        </div>
                        <div className='w-[200px] h-[14px] bg-slate-200 relative'>
                            <div className='h-full bg-[#EDBB0E] w-[10%]'></div>
                        </div>
                        <p className='text-sm text-slate-600 w-[0%]'>5</p>
                    </div>
                    <div className='flex justify-start items-center gap-5'>
                        <div className='text-md flex gap-1 w-[93px]'>
                            <RatingTemp rating={0} />
                        </div>
                        <div className='w-[200px] h-[14px] bg-slate-200 relative'>
                            <div className='h-full bg-[#EDBB0E] w-[0%]'></div>
                        </div>
                        <p className='text-sm text-slate-600 w-[0%]'>0</p>
                    </div>
                </div>
            </div>
            <h2 className='text-slate-600 text-xl font-bold py-5'>Product Reviews 22</h2>
            <div className='flex flex-col gap-8 pb-10 pt-4'>
                {
                [1,2,3,4,5,6].map((r, i) => <div className='flex flex-col gap-1'>
                    <div className='flex justify-between items-center'>
                    <div className='flex gap-1 text-xl'>
                        <RatingTemp rating={4} />
                    </div>
                    <span className='text-slate-600'>13 oct 2024</span>
                    </div>
                    <span className='text-slate-600 text-md'>Nguyen Van A</span>
                    <p className='text-slate-600 text-sm'>San pham chat luong dung anh</p>
                </div>)
                } 
                <div className='flex justify-end'>
                    {
                        totalReview > 5 && <Pagination pageNumber={pageNumber} setPageNumber={setPageNumber} totalItem={totalReview} perPage={perPage} showItem={Math.round(22 / 5)} />
                    }
                </div>
            </div>
            <div>
                {
                userInfo ? <div className='flex flex-col gap-3'>
                    <div className='flex gap-1'>
                    <RatingReact
                        onChange={(e) => setRat(e)}
                        initialRating={rat}
                        emptySymbol={<span className='text-slate-600 text-4xl'><CiStar /></span>}
                        fullSymbol={<span className='text-[#EDBB0E] text-4xl'><AiFillStar /></span>}
                    />
                    </div>
                    <form action=''>
                        <textarea className='border outline-0 p-3 w-full' name="" id="" cols="30" rows="5"></textarea>
                        <div className='mt-2'>
                            <button className='py-1 px-5 bg-indigo-500 text-white rounded-sm'>Submit</button>
                        </div>
                    </form>
                </div> : <div>
                    <Link className='py-1 px-5 bg-indigo-500 text-white rounded-sm' to='/login'>Login</Link>
                </div>
                }
            </div>
        </div>
        
    )
}

export default Reviews
