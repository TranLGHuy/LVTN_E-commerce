import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { get_product_details } from '../../store/Reducers/productReducer';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { GrClose } from 'react-icons/gr'; // Import Gr-close icon from react-icons

const ProductDetails = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const { productDetails, loader, error } = useSelector(state => state.product);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        dispatch(get_product_details(productId)); 
    }, [productId, dispatch]);

    if (loader) {
        return (
            <div className="flex justify-center items-center h-[300px]">
                <PropagateLoader color="#fff" cssOverride={overrideStyle} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-4">
                <p>Something went wrong while fetching the product details. Please try again later.</p>
            </div>
        );
    }

    if (!productDetails) {
        return (
            <div className="text-center text-gray-400 py-4">
                <p>Product not found</p>
            </div>
        );
    }

    const openImageModal = (image) => {
        setSelectedImage(image); // Set selected image
    };

    const closeModal = () => {
        setSelectedImage(null); // Close modal by resetting selected image
    };

    return (
        <div className="px-4 lg:px-12 pt-6">
            <div className="w-full p-6 bg-[#283046] rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-[#d0d2d6] text-3xl font-semibold">{productDetails?.name}</h1>
                    <Link
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-6 py-3 transition-all duration-300"
                        to="/seller/dashboard/products"
                    >
                        Back to Products
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-8"> {/* Changed to grid-cols-2 for two images per row */}
                    {/* Images Section */}
                    <div className="flex flex-wrap gap-4"> {/* Wrap the images for two in a row */}
                        {productDetails?.images?.map((img, i) => (
                            <div key={i} className="w-1/2">
                                <img
                                    className="w-full h-[200px] object-cover rounded-lg shadow-md hover:scale-105 transition-all duration-300 cursor-pointer" // Hover effect for zoom-in
                                    src={img}
                                    alt={`Product ${i}`}
                                    onClick={() => openImageModal(img)} // Open image in modal when clicked
                                />
                            </div>
                        ))}
                    </div>

                    {/* Product Information Section */}
                    <div className="text-[#d0d2d6] space-y-4">
                        <div className="bg-[#3a3f52] p-5 rounded-lg shadow-md">
                            <p className="text-sm text-gray-400 mb-2">
                                <span className="font-semibold">Brand:</span> <span className="text-white">{productDetails?.brand}</span>
                            </p>
                            <p className="text-sm text-gray-400 mb-2">
                                <span className="font-semibold">Category:</span> <span className="text-white">{productDetails?.category}</span>
                            </p>
                            <p className="text-sm text-gray-400 mb-2">
                                <span className="font-semibold">Price:</span> <span className="text-white">${productDetails?.price}</span>
                            </p>
                            <p className="text-sm text-gray-400 mb-2">
                                <span className="font-semibold">Discount:</span> <span className="text-white">{productDetails?.discount}%</span>
                            </p>
                            <p className="text-sm text-gray-400 mb-2">
                                <span className="font-semibold">Stock:</span> <span className="text-white">{productDetails?.stock}</span>
                            </p>
                        </div>

                        <div className="bg-[#3a3f52] p-5 rounded-lg shadow-md">
                            <p className="text-sm text-gray-400 mb-2">
                                <span className="font-semibold">Description:</span> <span className="text-white">{productDetails?.description}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="relative bg-white p-4 rounded-lg">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-black font-bold text-2xl"
                        >
                            <GrClose />
                        </button>
                        <img 
                            src={selectedImage} 
                            alt="Selected" 
                            className="w-[300px] h-[300px] object-cover rounded-md"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;

