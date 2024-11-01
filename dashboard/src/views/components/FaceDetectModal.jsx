import React, { useEffect, useRef, useState } from 'react';

const FaceDetectModal = ({ isOpen, onClose, sellerId }) => {
    const videoRef = useRef(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);

    useEffect(() => {
        const startVideo = async () => {
            if (videoRef.current) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
            }
        };

        if (isOpen) {
            startVideo();
        }

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [isOpen]);

    const captureImage = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg');
    };

    const handleVerifyFace = async (capturedImage) => {
        try {
            const response = await fetch('http://localhost:5001/verify-face', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    capturedImage: capturedImage,  // Ensure this is the base64 string
                    sellerId: '67020d5e80da03cf85ec7500',  // Ensure you have the seller ID
                }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('Face verification response:', data);
        } catch (error) {
            console.error('Error verifying face:', error);
        }
    };
    

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded p-5">
                <h2 className="text-lg font-bold mb-3">Face Detection</h2>
                <video ref={videoRef} autoPlay className="w-full h-auto" />
                <div className="flex justify-end mt-3">
                    <button onClick={handleVerifyFace} disabled={isVerifying} className="bg-blue-500 text-white px-4 py-2 rounded">
                        {isVerifying ? 'Verifying...' : 'Verify Face'}
                    </button>
                    <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded ml-2">
                        Close
                    </button>
                </div>
                {verificationResult && (
                    <div className="mt-3">
                        {verificationResult.match ? (
                            <p className="text-green-600">Face matched successfully!</p>
                        ) : (
                            <p className="text-red-600">{verificationResult.error || 'Face did not match.'}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FaceDetectModal;
