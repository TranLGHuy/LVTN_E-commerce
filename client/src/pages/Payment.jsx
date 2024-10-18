import React from 'react';
import Headers from '../components/Headers';
import Footer from '../components/Footer';
import { useLocation ,useNavigate } from 'react-router-dom';
import PayPal from '../components/Paypal';

const Payment = () => {
    const { state: { price, items ,orderId } } = useLocation();
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
            <section className='bg-[#eeeeee]'>
                <div className='w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16 mt-4'>
                    <div className='flex flex-wrap md:flex-col-reverse'>
                        <div className='w-6/12 md:w-full'>
                            <div className='pr-2 md:pr-0'>
                                <div className='flex flex-col items-center'>
                                    <img
                                        src="http://localhost:3000/images/1.gif" 
                                        alt="Payment Methods"
                                        className='w-[60%] h-auto'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='w-6/12 md:w-full'>
                            <div className='pl-2 md:pl-0 md:mb-0'>
                                <div className='bg-white shadow p-5 text-slate-600 flex flex-col gap-3'>
                                    <h2>Order Summary</h2>
                                    <div className='flex justify-between items-center'>
                                        <span>{items} items and shipping fee included</span>
                                        <span>${price}</span>
                                    </div>
                                    <div className='flex justify-between items-center font-semibold'>
                                        <span>Total Amount</span>
                                        <span className='text-lg text-orange-500'>${price}</span>
                                    </div>
                                    <button onClick={handleCashOnDelivery} className=' h-[50px] w-auto mt-3 px-5 py-[6px] rounded-sm bg-green-500 text-md font-bold text-white uppercase hover:shadow-green-500/20 hover:shadow-lg'>Cash on delivery</button>
                                    <PayPal price={price} items={items}/>
                                    
                                </div>
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
