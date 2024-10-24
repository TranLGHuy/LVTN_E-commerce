import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import FadeLoader from 'react-spinners/FadeLoader';
import errorImage from '../assets/error.jpg';
import successImage from '../assets/success.png';
import { active_stripe_connect_account, messageClear } from '../store/Reducers/sellerReducer';

const Success = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage } = useSelector(state => state.seller);
    const queryParams = new URLSearchParams(window.location.search);
    const activeCode = queryParams.get('activeCode');

    useEffect(() => {
        dispatch(active_stripe_connect_account(activeCode));
    }, [activeCode, dispatch]);

    const redirect = () => {
        dispatch(messageClear());
        navigate('/');
    };

    return (
        <div className='w-screen h-screen flex flex-col justify-center items-center bg-gray-100 p-6'>
            {loader ? (
                <FadeLoader color="#36d7b7" />
            ) : (
                <>
                    <div className='flex flex-col items-center bg-white shadow-lg rounded-lg p-8'>
                        {errorMessage ? (
                            <>
                                <img src={errorImage} alt="Error" className='w-32 h-32 mb-4' />
                                <h2 className='text-red-600 text-xl font-semibold mb-2'>Có lỗi xảy ra!</h2>
                                <p className='text-gray-600 mb-4'>{errorMessage}</p>
                            </>
                        ) : (
                            successMessage && (
                                <>
                                    <img src={successImage} alt="Success" className='w-32 h-32 mb-4' />
                                    <h2 className='text-green-600 text-xl font-semibold mb-2'>Kết nối thành công!</h2>
                                    <p className='text-gray-600 mb-4'>{successMessage}</p>
                                </>
                            )
                        )}
                        <button
                            onClick={redirect}
                            className='px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200'
                        >
                            Quay lại bảng điều khiển
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Success;
