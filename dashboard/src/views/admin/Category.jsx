import React ,{useState}from 'react'
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import Pagination from '../Pagination';
const Category = () => {
    const [currentPage,setCurrentPage] = useState(1)
    const [searchValue,setSearchvalue] = useState('')
    const[parPage,setParPage] = useState(5)
    const [show,setShow] = useState(false)
    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='flex flex-wrap w-full'>
                <div className='w-full lg:w-7/12'>
                    <div className='w-full p-4  bg-[#283046] rounded-md'>
                        <div className='flex justify-between items-center'>
                            <select onChange={(e)=> setParPage(parseInt(e.target.value))} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-500 rounded-md text-[#d0d2d6]'>
                                <option value="5">5</option>
                                <option value="5">15</option>
                                <option value="5">25</option>
                            </select>
                            <input className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-500 rounded-md text-[#d0d2d6]' type="text" placeholder='searh' />
                        </div>
                        <div className='relative overflow-x-auto'>
                        <table className='w-full text-sm text-left text-[#d0d2d6]'>
                            <thead className='text-sm  text-[#d0d2d6] uppercase border-b border-slate-700'>
                            <tr>
                                <th scope='col' className='py-3 px-4'>No</th>
                                <th scope='col' className='py-3 px-4'>Image</th>
                                <th scope='col' className='py-3 px-4'>Name</th>
                                <th scope='col' className='py-3 px-4'>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                                {
                                    [1,2,3,4,5,6].map((d,i) => <tr key={i}>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{d}</td>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                            <img className='w-[45px] h-[45px]'s src={`http://localhost:3000/images/category/${d}.jpg`} alt=""></img>
                                        </td>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                            <span>Sports</span>
                                        </td>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                            <div className='flex justify-start items-center gap-4'>
                                                <Link className='p-[6px] bg-blue-500 rounded hover:shadow-lg hover:shadow-blue-500/50'><FaEdit/></Link>
                                                <Link className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'><FaRegTrashCan/></Link>
                                            </div>
                                        </td>
                                    </tr>)
                                } 
                            </tbody>
                        </table>
                    </div>
                    <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                        <Pagination 
                            pageNumber = {currentPage}
                            setPageNumber = {setCurrentPage}
                            totalItem = {50}
                            parPage = {parPage}
                            showItem = {3}
                        />
                    </div>
                </div>
            </div>
            <div className={`w-[320px] lg:w-5/12 translate-x-100 lg:relative lg:right-0 fixed ${show ? 'right-0':'-right-[340px'} z-20 top-0 transition-all duration-500`}>
                <div className='w-full pl-5 '>
                    <div className='bg-[#283046] h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#d0d2d6]'>
                        <h1 className='text-[#d0d2d6] font-semibold text-xl mb-4 w-full text-center'>Add Category</h1>
                        <form>
                            <div className='flex flex-col w-full gap-1 mb-3'>
                                <label  htmlFor='name'>Category Name</label>
                                <input className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-500 rounded-md text-[#d0d2d6]' type="text" id='name' name='category_name' placeholder='category name' />
                            </div>
                            <div>
                                <label htmlFor="image">
                                    <span>
                                        
                                    </span>
                                </label>
                            </div>
                        </form>
                    </div>   
                </div> 
            </div>
        </div>
    </div>
  )
}

export default Category
