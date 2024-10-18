import React from 'react';
import { useLocation,Link } from 'react-router-dom';
import Headers from '../components/Headers';
import Footer from '../components/Footer';

const OrderSuccess = () => {
    const { state } = useLocation();

    return (
        <div>
            <Headers />
            <section className='bg-[#eeeeee]'>
                <div className='w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-5 mt-2'>
                    <div className='bg-white p-6 shadow-md rounded-md flex flex-col items-center'>
                        {/* Add GIF here */}
                        <img
                            src="http://localhost:3000/images/3.gif" // Replace with your GIF URL
                            alt="Order Success"
                            className='w-[50%] h-auto mb-4' // Adjust size as needed
                        />
                        <h2 className='text-2xl font-semibold text-green-600'>Order Successful!</h2>
                        <p className='text-slate-600 mt-4'>Thank you for your order!</p>
                        {state && (
                            <div className='mt-4'>
                                <h3 className='font-semibold'>Order Details:</h3>
                                <p>Order ID: <span className='font-bold'>{state.orderId}</span></p>
                                <p>Total Amount: <span className='font-bold'>${state.totalAmount}</span></p>
                                <p>Items Ordered: <span className='font-bold'>{state.items}</span></p>
                            </div>
                        )}
                        <div className='mt-6'>
                            <Link to='/' className='px-5 py-[6px] rounded-sm bg-blue-500 text-white uppercase hover:bg-blue-600 transition-colors duration-200'>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default OrderSuccess;
