import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { get_order } from '../../store/reducers/orderReducer'

const Order = () => {

    const { orderId } = useParams()
    const dispatch = useDispatch()
    const { myOrder } = useSelector(state => state.order)
    const { userInfo } = useSelector(state => state.auth)

    useEffect(() => {
        dispatch(get_order(orderId))
    }, [orderId])

    return (
        <div className='bg-gray-50 p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-10'>
            <h2 className='text-gray-700 text-2xl font-bold mb-5'>Order Details: <span className='text-indigo-600'>#{myOrder._id}</span></h2>
            <div className='grid grid-cols-2 gap-8'>
                <div className='flex flex-col gap-3'>
                    <h2 className='text-gray-600 font-semibold text-lg'>Deliver to: {myOrder.shippingInfo?.name}</h2>
                    <p className='flex items-center'>
                        <span className='bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded'>Home</span>
                        <span className='text-gray-600'>{myOrder.shippingInfo?.address}, {myOrder.shippingInfo?.province}, {myOrder.shippingInfo?.city}, {myOrder.shippingInfo?.area}</span>
                    </p>
                    <p className='text-gray-600 font-semibold'>Email: {userInfo.email}</p>
                </div>
                <div className='text-gray-600'>
                    <h2 className='font-semibold'>Price: <span className='text-green-500'>${myOrder.price}</span> (includes shipping)</h2>
                    <p>Payment status: <span className={`py-1 px-3 text-xs rounded-md ${myOrder.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{myOrder.payment_status}</span></p>
                    <p>Order status: <span className={`py-1 px-3 text-xs rounded-md ${myOrder.delivery_status === 'delivered' ? 'bg-indigo-100 text-indigo-800' : 'bg-yellow-100 text-yellow-800'}`}>{myOrder.delivery_status}</span></p>
                </div>
            </div>
            <div className='mt-8'>
                <h2 className='text-gray-700 text-xl font-semibold mb-4'>Products</h2>
                <div className='grid grid-cols-2 gap-6'>
                    {
                        myOrder.products?.map((p, i) => (
                            <div key={i} className='bg-white p-4 rounded-lg shadow-md flex gap-4'>
                                <img className='w-20 h-20 object-cover rounded-md' src={p.images[0]} alt="product" />
                                <div className='flex flex-col justify-between'>
                                    <div>
                                        <Link to={`/product/details/${p._id}`} className='text-lg text-indigo-600 hover:underline'>{p.name}</Link>
                                        <p className='text-sm text-gray-500'>Brand: {p.brand}</p>
                                        <p className='text-sm text-gray-500'>Quantity: {p.quantity}</p>
                                    </div>
                                    <div>
                                        <h2 className='text-orange-500 text-lg'>Total: ${p.price - Math.floor((p.price * p.discount) / 100)}</h2>
                                        {p.discount > 0 && (
                                            <>
                                                <p className='line-through text-gray-400 text-sm'>Original: ${p.price}</p>
                                                <p className='text-sm text-green-600'>Discount: -{p.discount}%</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Order
