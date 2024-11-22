import React, { useEffect, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { PropagateLoader } from 'react-spinners'
import { overrideStyle } from '../../utils/utils'
import { GrClose } from 'react-icons/gr'
import { Link } from 'react-router-dom'
import Pagination from '../Pagination'
import { BsImage } from 'react-icons/bs'
import toast from 'react-hot-toast'
import { useSelector, useDispatch } from 'react-redux'
import Search from '../components/Search'
import { categoryAdd, messageClear, get_category, deleteCategory } from '../../store/Reducers/categoryReducer'

const Category = () => {
    const dispatch = useDispatch()
    const { loader, successMessage, errorMessage, categories } = useSelector(state => state.category)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)
    const [show, setShow] = useState(false)
    const [imageShow, setImage] = useState('')
    const [state, setState] = useState({
        name: '',
        image: ''
    })

    // Modal and delete state
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState(null)

    const imageHandle = (e) => {
        let files = e.target.files
        if (files.length > 0) {
            setImage(URL.createObjectURL(files[0]))
            setState({
                ...state,
                image: files[0]
            })
        }
    }

    const add_category = (e) => {
        e.preventDefault()
        dispatch(categoryAdd(state))
    }

    const handleDelete = (categoryId) => {
        setCategoryToDelete(categoryId)
        setShowDeleteModal(true)
    }

    const confirmDelete = () => {
        dispatch(deleteCategory(categoryToDelete)).then(() => {
            dispatch(get_category({
                parPage: parseInt(parPage),
                page: parseInt(currentPage),
                searchValue
            }));
        });
        setShowDeleteModal(false);
    };
    
    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
    
            // Reset state khi thêm mới hoặc xóa danh mục
            setState({
                name: '',
                image: ''
            });
            setImage('');
            setCategoryToDelete(null);
    
            // Gọi lại API danh mục để cập nhật danh sách
            dispatch(get_category({
                parPage: parseInt(parPage),
                page: parseInt(currentPage),
                searchValue
            }));
        }
    }, [successMessage, errorMessage]);
    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }
        dispatch(get_category(obj))
    }, [searchValue, currentPage, parPage])

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='flex lg:hidden justify-between items-center mb-5 p-4 bg-[#283046] rounded-md'>
                <h1 className='text-[#d0d2d6] font-semibold text-lg'>Categories</h1>
                <button onClick={() => setShow(true)} className='bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 px-4 py-2 cursor-pointer text-white rounded-sm text-sm'>Add</button>
            </div>
            <div className='flex flex-wrap w-full'>
                <div className='w-full lg:w-7/12'>
                    <div className='w-full p-4  bg-[#283046] rounded-md'>
                        <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />
                        <div className='relative overflow-x-auto'>
                            <table className='w-full text-sm text-left text-[#d0d2d6]'>
                                <thead className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
                                    <tr>
                                        <th scope='col' className='py-3 px-4'>No</th>
                                        <th scope='col' className='py-3 px-4'>Image</th>
                                        <th scope='col' className='py-3 px-4'>Name</th>
                                        <th scope='col' className='py-3 px-4'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        categories.map((d, i) => <tr key={i}>
                                            <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{i + 1}</td>
                                            <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                                <img className='w-[45px] h-[45px]' src={d.image} alt="" />
                                            </td>
                                            <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                                <span>{d.name}</span>
                                            </td>
                                            <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                                <div className='flex justify-start items-center gap-4'>
                                                    <Link className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'><FaEdit /></Link>
                                                    <button onClick={() => handleDelete(d._id)} className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50'>
                                                        <FaTrash />
                                                    </button>
                                                </div>
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

                {/* Add Category Modal */}
                <div className={`w-[320px] lg:w-5/12 translate-x-100 lg:relative lg:right-0 fixed ${show ? 'right-0' : '-right-[340px]'} z-[9999] top-0 transition-all duration-500`}>
                    <div className='w-full pl-5'>
                        <div className='bg-[#283046] h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#d0d2d6]'>
                            <div className='flex justify-between items-center mb-4'>
                                <h1 className='text-[#d0d2d6] font-semibold text-xl'>Add Category</h1>
                                <div onClick={() => setShow(false)} className='block lg:hidden cursor-pointer'><GrClose className='text-[#d0d2d6]' /></div>
                            </div>
                            <form onSubmit={add_category}>
                                <div className='flex flex-col w-full gap-1 mb-3'>
                                    <label htmlFor="name">Category name</label>
                                    <input value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" id='name' name='category_name' placeholder='category name' required />
                                </div>
                                <div>
                                    <label className='flex justify-center items-center flex-col h-[238px] cursor-pointer border border-dashed hover:border-indigo-500 w-full border-[#d0d2d6]' htmlFor="image">
                                        {
                                            imageShow ? <img className='w-full h-full' src={imageShow} /> : <><span><BsImage /></span><span>select Image</span></>
                                        }
                                    </label>
                                </div>
                                <input onChange={imageHandle} className='hidden' type="file" name='image' id='image' required />
                                <div className='mt-4'>
                                    <button disabled={loader ? true : false} className='bg-blue-500 w-full hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'>
                                        {
                                            loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Add Category'
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-md text-center">
                        <h2 className="mb-4 text-xl">Are you sure you want to delete this category?</h2>
                        <div className="flex justify-center gap-4">
                            <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded-md">Yes, Delete</button>
                            <button onClick={() => setShowDeleteModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Category
