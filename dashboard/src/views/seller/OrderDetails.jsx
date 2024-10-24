import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { messageClear, get_seller_order, seller_order_status_update } from '../../store/Reducers/OrderReducer';

const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { order, errorMessage, successMessage } = useSelector(state => state.order);

  const [status, setStatus] = useState('');

  useEffect(() => {
    dispatch(get_seller_order(orderId));
  }, [orderId, dispatch]);

  useEffect(() => {
    setStatus(order?.delivery_status);
  }, [order]);

  const status_update = (e) => {
    dispatch(seller_order_status_update({ orderId, info: { status: e.target.value } }));
    setStatus(e.target.value);
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  return (
    <div className="px-4 lg:px-8 pt-6">
      <div className="w-full p-6 bg-gray-800 rounded-md">
        <div className="flex justify-between items-center pb-4 border-b border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-200">Order Details</h2>
          <select
            onChange={status_update}
            value={status}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:outline-none"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="warehouse">Warehouse</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="py-6">
          <div className="flex gap-4 text-lg text-gray-200">
            <h2 className="font-bold">Order ID: #{order?._id}</h2>
            <span>{order?.date}</span>
          </div>

          <div className="flex flex-wrap mt-6 gap-8">
            <div className="w-full md:w-1/3 bg-gray-900 p-4 rounded-md">
                <h2 className="text-lg font-semibold text-gray-300">Deliver To:</h2>
                <p className="text-sm text-gray-400">
                    {order?.shippingInfo}
                </p>
                {/* <p className="mt-2">
                    <span className="font-semibold text-gray-300">Phone: </span>
                    <span className="text-gray-400">{order?.shippingInfo?.phone}</span>
                </p> */}

                <div className="mt-4 text-gray-300">
                    <h3 className="font-semibold">Payment Status:</h3>
                    <p>{order?.payment_status}</p>
                    <p className="mt-2">Price: ${order?.price}</p>
                </div>
            </div>

            <div className="w-full md:w-2/3">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-300 mb-4">Products:</h3>
                {order?.products && order.products.map((p, i) => (
                  <div key={i} className="flex gap-4 bg-gray-900 p-4 rounded-md">
                    <img className="w-[60px] h-[60px] object-cover" src={p.images[0]} alt={p.name} />
                    <div className="text-gray-400">
                      <h2 className="font-semibold text-lg">{p.name}</h2>
                      <p>
                        <span>Brand: {p.brand}</span>
                        <span className="ml-4">Quantity: {p.quantity}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
