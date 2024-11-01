import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { upload_face_image } from '../../store/Reducers/authReducer';
import toast from 'react-hot-toast';

Modal.setAppElement('#root');

const CaptureFaceImageModal = ({ isOpen, onRequestClose }) => {
    const dispatch = useDispatch();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [mode, setMode] = useState('capture');

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1900 }, height: { ideal: 1200 } }
            });
            setStream(mediaStream);
            videoRef.current.srcObject = mediaStream;
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (isOpen && !stream) {
            startCamera();
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
        };
    }, [isOpen, stream]);

    const captureImage = () => {
        const context = canvasRef.current.getContext('2d');
        const canvasWidth = 1900;
        const canvasHeight = 1200;
        canvasRef.current.width = canvasWidth;
        canvasRef.current.height = canvasHeight;
        context.drawImage(videoRef.current, 0, 0, canvasWidth, canvasHeight);
        
        canvasRef.current.toBlob((blob) => {
            if (blob) {
                setCapturedImage(URL.createObjectURL(blob));
            }
        }, 'image/jpeg');
        
        // Stop the camera after capturing the image
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const saveImage = async () => {
        if (capturedImage) {
            const formData = new FormData();
            const response = await fetch(capturedImage);
            const blob = await response.blob();
            formData.append('face_image', blob);
            try {
                await dispatch(upload_face_image(formData));
                toast.success('Image uploaded successfully!');
                onRequestClose(); // Close the modal after saving
            } catch (error) {
                toast.error('Upload failed.');
            }
        } else {
            toast.error('No image captured to save.');
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const handleUploadImage = async () => {
        if (fileInputRef.current.files.length > 0) {
            const formData = new FormData();
            formData.append('face_image', fileInputRef.current.files[0]);
            try {
                await dispatch(upload_face_image(formData));
                toast.success('Image uploaded successfully!');
                setSelectedImage(URL.createObjectURL(fileInputRef.current.files[0]));
                onRequestClose();
            } catch (error) {
                toast.error('Upload failed.');
            }
        } else {
            toast.error('No file selected.');
        }
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        if (newMode === 'capture') {
            setSelectedImage(null); // Clear preview image when switching to capture mode
            startCamera(); // Start camera when switching to capture mode
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg w-96"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-lg font-semibold mb-4">Chụp ảnh khuôn mặt</h2>
            <div className="flex mb-4">
                <button
                    onClick={() => handleModeChange('capture')}
                    className={`px-4 py-2 ${mode === 'capture' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} rounded flex-1`}
                >
                    Chụp ảnh
                </button>
                <button
                    onClick={() => handleModeChange('upload')}
                    className={`px-4 py-2 ${mode === 'upload' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} rounded flex-1`}
                >
                    Tải lên ảnh
                </button>
            </div>

            {mode === 'capture' ? (
                <>
                    {!capturedImage ? (
                        <>
                            <video ref={videoRef} autoPlay className="mb-4 w-full" />
                            <canvas ref={canvasRef} className="hidden" />
                            <div className="flex justify-between w-full mb-4">
                                <button
                                    onClick={captureImage}
                                    className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
                                >
                                    Chụp ảnh
                                </button>
                                <button
                                    onClick={onRequestClose}
                                    className="bg-gray-500 text-white rounded-lg px-4 py-2 hover:bg-gray-700"
                                >
                                    Đóng
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center mb-4">
                            <img
                                src={capturedImage}
                                alt="Captured"
                                className="mb-4 w-full rounded-lg border-2 border-blue-500"
                            />
                            <div className="flex justify-between w-full mb-4">
                                <button
                                    onClick={() => {
                                        setCapturedImage(null);
                                        startCamera(); // Restart the camera if the user wants to capture again
                                    }}
                                    className="bg-orange-500 text-white rounded-lg px-4 py-2 hover:bg-orange-700"
                                >
                                    Chụp lại
                                </button>
                                <button
                                    onClick={saveImage} 
                                    className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
                                >
                                    Lưu ảnh
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mb-4 border border-gray-300 rounded-lg p-2 w-full"
                        ref={fileInputRef}
                    />
                    {selectedImage && (
                        <div className="flex justify-center mb-4">
                            <img
                                src={selectedImage}
                                alt="Selected"
                                className="mb-4 w-48 h-auto rounded-lg border-2 border-blue-500"
                            />
                        </div>
                    )}
                    <div className="flex justify-between w-full mb-4">
                        <button
                            onClick={handleUploadImage}
                            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
                        >
                            Tải lên
                        </button>
                        <button
                            onClick={onRequestClose}
                            className="bg-gray-500 text-white rounded-lg px-4 py-2 hover:bg-gray-600"
                        >
                            Đóng
                        </button>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default CaptureFaceImageModal;
