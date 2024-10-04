import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Pagination from '../Pagination'
import Search from '../components/Search'
import { GrView } from "react-icons/gr";


const Orders = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)
  return (
    <div className='px-2 lg:px-7 pt-5 '>
            <div className='w-full p-4  bg-[#283046] rounded-md'>
                <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />
                <div className='relative overflow-x-auto'>
                    <table className='w-full text-sm text-left text-[#d0d2d6]'>
                        <thead className='text-sm  text-[#d0d2d6] uppercase border-b border-slate-700'>
                        <tr>
                            <th scope='col' className='py-3 px-4'>Order ID</th>
                            <th scope='col' className='py-3 px-4'>Price</th>
                            <th scope='col' className='py-3 px-4'>Payment Status</th>
                            <th scope='col' className='py-3 px-4'>Order Status</th>
                            <th scope='col' className='py-3 px-4'>Active</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            [1,2,3,4,5].map((d,i) => <tr key={i}>
                            <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>#1456fgh3313</td>
                            <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>$300</td>
                            <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>
                            <span>Pending</span>
                            </td>
                            <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>
                            <span>Pending</span>
                            </td>
                            <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>
                            <Link to={`/seller/dashboard/order/details/1`} className='p-[6px] w-[30px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50 flex justify-center items-center'><GrView/></Link>
                            </td>
                        </tr>)
                        }
                        </tbody>
                    </table>
                </div>
                <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={50}
                            parPage={parPage}
                            showItem={3}
                        />
                </div>
            </div>
        </div>
  )
}

export default Orders
