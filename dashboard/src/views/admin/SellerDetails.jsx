import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useSelector, useDispatch } from 'react-redux'
import { get_seller, seller_status_update, messageClear } from '../../store/Reducers/sellerReducer'
import { GrClose } from 'react-icons/gr' // Import GrClose icon from react-icons

const SellerDetails = () => {
    const dispatch = useDispatch()
    const { seller, successMessage } = useSelector(state => state.seller)
    const { sellerId } = useParams()

    const [status, setStatus] = useState('')
    const [modalImageIdCard, setModalImageIdCard] = useState(null) // State to hold both ID card images
    const [modalImageFace, setModalImageFace] = useState(null) // State to hold Face image

    useEffect(() => {
        dispatch(get_seller(sellerId))
    }, [sellerId])

    const submit = (e) => {
        e.preventDefault()
        dispatch(seller_status_update({
            sellerId,
            status
        }))
    }

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
    }, [successMessage])

    useEffect(() => {
        if (seller) {
            setStatus(seller.status)
        }
    }, [seller])

    // Function to open ID Card image modal (both front and back)
    const openImageIdCardModal = (frontImage, backImage) => {
        setModalImageIdCard({ front: frontImage, back: backImage })
    }

    // Function to open Face image modal
    const openImageFaceModal = (image) => {
        setModalImageFace(image)
    }

    // Function to close both modals
    const closeModal = () => {
        setModalImageIdCard(null)
        setModalImageFace(null)
    }

    return (
        <div className="px-4 lg:px-10 pt-6">
            <div className="w-full p-6 bg-[#283046] rounded-lg shadow-lg">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image Section */}
                    <div className="flex justify-center items-center w-full lg:w-4/12">
                        <div className="w-[250px] h-[250px] bg-slate-800 rounded-lg flex justify-center items-center">
                            {
                                seller?.image ? (
                                    <img className="w-full h-full object-cover rounded-lg" src={seller?.image} alt="Seller" />
                                ) : (
                                    <span className="text-white">Image not uploaded</span>
                                )
                            }
                        </div>
                    </div>

                    {/* Seller Info Section */}
                    <div className="flex-1">
                        <div className="mb-4">
                            <h2 className="text-xl text-white font-semibold">Basic Info</h2>
                            <div className="bg-slate-800 rounded-md p-4 mt-2">
                                <div className="grid grid-cols-2 gap-2 text-white text-sm">
                                    <div className="flex gap-2 py-1">
                                        <span className="font-medium">Name:</span>
                                        <span>{seller?.name}</span>
                                    </div>
                                    <div className="flex gap-2 py-1">
                                        <span className="font-medium">Email:</span>
                                        <span>{seller?.email}</span>
                                    </div>
                                    <div className="flex gap-2 py-1">
                                        <span className="font-medium">Role:</span>
                                        <span>{seller?.role}</span>
                                    </div>
                                    <div className="flex gap-2 py-1">
                                        <span className="font-medium">Status:</span>
                                        <span>{seller?.status}</span>
                                    </div>
                                    <div className="flex gap-2 py-1">
                                        <span className="font-medium">Payment Account:</span>
                                        <span>{seller?.payment}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seller Documents Section */}
                        <div className="mb-4">
                            <h2 className="text-xl text-white font-semibold">Documents</h2>
                            <div className="bg-slate-800 rounded-md p-4 mt-2">
                                <div className="text-white text-sm">
                                    <div className="flex gap-2 py-1">
                                        <span className="font-medium">ID Card Image:</span>
                                        {seller?.idCardImages && seller?.idCardImages.length === 2 ? (
                                            <button 
                                                className="text-blue-400"
                                                onClick={() => openImageIdCardModal(seller.idCardImages[0], seller.idCardImages[1])}
                                            >
                                                View Both Images
                                            </button>
                                        ) : (
                                            <span className="text-red-400">(Not Uploaded)</span>
                                        )}
                                    </div>
                                    <div className="flex gap-2 py-1">
                                        <span className="font-medium">Face Image:</span>
                                        {seller?.faceImage ? (
                                            <button 
                                                className="text-blue-400"
                                                onClick={() => openImageFaceModal(seller.faceImage)}
                                            >
                                                View Image
                                            </button>
                                        ) : (
                                            <span className="text-red-400">(Not Uploaded)</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="mb-4">
                            <h2 className="text-xl text-white font-semibold">Address</h2>
                            <div className="bg-slate-800 rounded-md p-4 mt-2">
                                <div className="grid grid-cols-2 gap-2 text-white text-sm">
                                    <div className="flex gap-2 py-1">
                                        <span className="font-medium">Shop Name:</span>
                                        <span>{seller?.shopInfo?.shopName}</span>
                                    </div>
                                    <div className="flex gap-2 py-1">
                                        <span className="font-medium">Phone Number:</span>
                                        <span>{seller?.shopInfo?.phoneNumber}</span>
                                    </div>
                                    <div className="flex gap-2 py-1">
                                        <span className="font-medium">Address:</span>
                                        <span>{seller?.shopInfo?.address}</span>
                                    </div>
                                    <div className="flex gap-2 py-1">
                                        <span className="font-medium">City:</span>
                                        <span>{seller?.shopInfo?.city}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Update Form */}
                <div className="mt-6">
                    <h2 className="text-xl text-white font-semibold">Update Status</h2>
                    <form onSubmit={submit} className="mt-2">
                        <div className="flex gap-4 py-3">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="px-4 py-2 bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6] focus:border-indigo-500 outline-none"
                                required
                            >
                                <option value="">-- Select Status --</option>
                                <option value="active">Active</option>
                                <option value="deactive">Deactive</option>
                            </select>
                            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-7 py-2 w-[170px]">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal for ID Card Image (Front and Back) */}
            {modalImageIdCard && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded-lg max-w-lg relative">
                        <GrClose onClick={closeModal} className="text-black text-xl absolute top-2 right-2 cursor-pointer" />
                        <div className="flex gap-4">
                            <div className="w-[300px] h-[300px]">
                                <img src={modalImageIdCard.front} alt="ID Card Front" className="w-full h-full object-cover rounded-lg" />
                            </div>
                            <div className="w-[300px] h-[300px]">
                                <img src={modalImageIdCard.back} alt="ID Card Back" className="w-full h-full object-cover rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Face Image */}
            {modalImageFace && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded-lg max-w-lg relative">
                        <GrClose onClick={closeModal} className="text-black text-xl absolute top-2 right-2 cursor-pointer" />
                        <div className="w-[300px] h-[300px]">
                            <img src={modalImageFace} alt="Face Image" className="w-full h-full object-cover rounded-lg" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SellerDetails
