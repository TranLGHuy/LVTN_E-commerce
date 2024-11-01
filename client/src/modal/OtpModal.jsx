import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, resendOtp } from '../../reducers/authReducer'; // Import các action cần thiết

const OtpModal = ({ isOpen, onClose, registrationData }) => {
    const [otp, setOtp] = useState('');
    const dispatch = useDispatch();
    const { loading, errorMessage, successMessage } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isOpen) {
            // Gửi OTP khi modal mở
            const sendOtp = async () => {
                await dispatch(resendOtp({ email: registrationData.email }));
            };
            sendOtp();
        }
    }, [isOpen, dispatch, registrationData.email]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Gửi yêu cầu xác thực OTP
        dispatch(verifyOtp({ email: registrationData.email, otp }));
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose}>
            <h2>Nhập mã OTP</h2>
            {loading && <p>Đang gửi mã OTP...</p>}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Nhập mã OTP"
                    required
                />
                <button type="submit">Xác nhận</button>
                <button type="button" onClick={onClose}>Đóng</button>
            </form>
        </Modal>
    );
};

export default OtpModal;
