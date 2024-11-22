import React, { useState, useEffect } from 'react'
import { FaEdit, FaEye, FaTrash, FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Pagination from '../Pagination'
import Search from '../components/Search'
import { get_products, delete_product } from '../../store/Reducers/productReducer'

const Products = () => {
    const dispatch = useDispatch()
    const { products, totalProduct } = useSelector(state => state.product)

    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)
    const [showModal, setShowModal] = useState(false)
    const [productIdToDelete, setProductIdToDelete] = useState(null)
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }
        dispatch(get_products(obj))
    }, [searchValue, currentPage, parPage])

    const handleDelete = (id) => {
        setProductIdToDelete(id)
        setShowModal(true)
    }

    const confirmDelete = () => {
        dispatch(delete_product(productIdToDelete)).then(() => {
            const obj = {
                parPage: parseInt(parPage),
                page: parseInt(currentPage),
                searchValue
            }
            dispatch(get_products(obj))

            setSuccessMessage('Product deleted successfully!')
            setShowModal(false)
        }).catch((error) => {
            setSuccessMessage('Error deleting product.')
            setShowModal(false)
        })
    }

    const cancelDelete = () => {
        setShowModal(false)
        setProductIdToDelete(null)
    }

    const closeSuccessMessage = () => {
        setSuccessMessage('')
    }

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-[#283046] rounded-md'>
                <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />
                <div className='relative overflow-x-auto mt-5'>
                    <table className='w-full text-sm text-left text-[#d0d2d6]'>
                        <thead className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
                            <tr>
                                <th scope='col' className='py-3 px-4'>No</th>
                                <th scope='col' className='py-3 px-4'>Image</th>
                                <th scope='col' className='py-3 px-4 w-[10%]'>Name</th>
                                <th scope='col' className='py-3 px-4'>Category</th>
                                <th scope='col' className='py-3 px-4'>Brand</th>
                                <th scope='col' className='py-3 px-4'>Price</th>
                                <th scope='col' className='py-3 px-4'>Discount</th>
                                <th scope='col' className='py-3 px-4'>Stock</th>
                                <th scope='col' className='py-3 px-4'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((d, i) => (
                                <tr key={i}>
                                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{i + 1}</td>
                                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                        <img className='w-[45px] h-[45px]' src={d.images[0]} alt="" />
                                    </td>
                                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                        <span>{d?.name?.length > 16 ? `${d.name.slice(0, 16)}...` : d.name}</span>
                                    </td>
                                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                        <span>{d.category}</span>
                                    </td>
                                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                        <span>{d.brand}</span>
                                    </td>
                                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                        <span>${d.price}</span>
                                    </td>
                                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                        {d.discount === 0 ? <span>no discount</span> : <span>${d.discount}%</span>}
                                    </td>
                                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                        <span>{d.stock}</span>
                                    </td>
                                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                        <div className='flex justify-start items-center gap-4'>
                                            <Link to={`/seller/dashboard/edit-product/${d._id}`} className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'><FaEdit /></Link>
                                            <Link to={`/seller/dashboard/product-details/${d._id}`} className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'><FaEye /></Link>
                                            <button 
                                                onClick={() => handleDelete(d._id)} 
                                                className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50'>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {totalProduct > parPage && (
                    <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={50}
                            parPage={parPage}
                            showItem={4}
                        />
                    </div>
                )}
            </div>

            {/* Modal confirmation delete */}
            {showModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
                        <p>Are you sure you want to delete this product?</p>
                        <div className="mt-4 flex justify-end gap-4">
                            <button onClick={cancelDelete} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                            <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Message (Centered on screen) */}
            {successMessage && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
                    <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg relative max-w-sm w-full">
                        <p>{successMessage}</p>
                        <FaTimes 
                            className="absolute top-2 right-2 text-white cursor-pointer"
                            onClick={closeSuccessMessage}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Products
