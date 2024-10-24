import React, { useState } from 'react';
import Headers from '../components/Headers';
import Footer from '../components/Footer';
import Stripe from '../components/Stripe';
import { useLocation,useNavigate } from 'react-router-dom';

const Payment = () => {
    const { state: { price, items, orderId } } = useLocation();
    const [paymentMethod, setPaymentMethod] = useState('stripe');
    const navigate = useNavigate();
    const handleCashOnDelivery = () => {
        navigate('/order-success', {
            state: {
                orderId: orderId,
                totalAmount: price,
                items,
            },
        });
    };
    return (
        <div>
            <Headers />
            <section className='bg-[#f0f4f8]'>
                <div className='w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16 mt-4'>
                    <div className='flex flex-wrap md:flex-col-reverse'>
                        <div className='w-6/12 md:w-full'>
                            <div className='flex flex-col items-center'>
                                <img
                                    src="http://localhost:3000/images/1.gif" 
                                    alt="Payment Methods"
                                    className='w-[60%] h-auto'
                                />
                            </div>
                        </div>
                        <div className='w-6/12 md:w-full'>
                            <div className='bg-white shadow-lg rounded-lg p-5 text-slate-600 flex flex-col gap-3'>
                                <h2 className='text-2xl font-bold text-center text-gray-800'>Order Summary</h2>
                                <div className='flex justify-between items-center'>
                                    <span>{items} items and shipping fee included</span>
                                    <span className='text-lg font-semibold'>${price}</span>
                                </div>
                                <div className='flex justify-between items-center font-semibold'>
                                    <span>Total Amount</span>
                                    <span className='text-lg text-orange-600'>${price}</span>
                                </div>
                                <div className='flex flex-wrap mt-4'>
                                    <div
                                        onClick={() => setPaymentMethod('stripe')}
                                        className={`w-1/3 border-r cursor-pointer py-4 flex justify-center items-center ${paymentMethod === 'stripe' ? 'bg-blue-500 text-white' : 'bg-blue-100'}`}
                                    >
                                        <span className='font-semibold'>Stripe</span>
                                    </div>
                                    <div
                                        onClick={() => {setPaymentMethod('cashOnDelivery')}
                                        }
                                        className={`w-1/3 border-r cursor-pointer py-4 flex justify-center items-center ${paymentMethod === 'cashOnDelivery' ? 'bg-blue-500 text-white' : 'bg-blue-100'}`}
                                    >
                                        <span  className='font-semibold'>Cash on Delivery</span>
                                    </div>
                                    <div
                                        onClick={() => setPaymentMethod('paypal')}
                                        className={`w-1/3 cursor-pointer py-4 flex justify-center items-center ${paymentMethod === 'paypal' ? 'bg-blue-500 text-white' : 'bg-blue-100'}`}
                                    >
                                        <span className='font-semibold'>PayPal</span>
                                    </div>
                                </div>

                                {paymentMethod === 'stripe' && (
                                    <div className='mt-4'>
                                    <Stripe orderId={orderId} price={price} />
                                </div>
                                )}
                                {paymentMethod === 'paypal' && (
                                    <div className='w-full mt-4'>
                                        <button className='w-full px-4 py-3 rounded-md hover:bg-orange-500 bg-orange-400 text-white transition duration-200'>
                                            Pay with PayPal
                                        </button>
                                    </div>
                                )}
                                {paymentMethod === 'cashOnDelivery' && (
                                    <div className='w-full mt-4'>
                                        <button onClick={() => handleCashOnDelivery()} className='w-full px-4 py-3 rounded-md hover:bg-orange-500 bg-orange-400 text-white transition duration-200'>
                                            Pay Cash on Delivery
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default Payment;
