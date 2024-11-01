
    import React, { useRef, useState } from 'react';
    import Modal from 'react-modal';
    import { upload_id_card } from '../../store/Reducers/authReducer';
    import toast from 'react-hot-toast';
    import { useDispatch } from 'react-redux';
    Modal.setAppElement('#root');
    
    const UploadIdCardModal = ({ isOpen, onRequestClose, onUpload }) => {
        const dispatch = useDispatch();
        const fileInputRef = useRef(null);
        const [selectedImage, setSelectedImage] = useState(null); // State to store selected image
    
        const handleFileChange = (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                setSelectedImage(URL.createObjectURL(file)); // Create a local URL for the selected file
            }
        };
    
        const handleUpload = async () => {
            if (fileInputRef.current.files.length > 0) {
                const formData = new FormData();
                formData.append('id_image', fileInputRef.current.files[0]);
    
                console.log([...formData]); // Check the contents of formData
    
                try {
                    await dispatch(upload_id_card(formData)); 
                    onUpload();
                    onRequestClose(); 
                } catch (error) {
                    toast.error("Upload failed.");
                }
            } else {
                toast.error("No file selected.");
            }
        };
    
        return (
            <Modal 
                isOpen={isOpen} 
                onRequestClose={onRequestClose} 
                className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg w-96"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-lg font-semibold mb-4">Tải lên ID Card</h2>
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange} 
                    className="mb-4 border border-gray-300 rounded-lg p-2"
                    ref={fileInputRef} 
                />
                {selectedImage && (
                    <img 
                        src={selectedImage} 
                        alt="Selected ID" 
                        className="mb-4 w-full h-auto rounded-lg"
                    />
                )}
                <div className="flex justify-between w-full">
                    <button 
                        onClick={onRequestClose} 
                        className="bg-gray-500 text-white rounded-lg px-4 py-2 hover:bg-gray-600"
                    >
                        Đóng
                    </button>
                    <button 
                        onClick={handleUpload} // Submit the image
                        className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
                    >
                        Gửi ảnh
                    </button>
                </div>
            </Modal>
        );
    };
    
    export default UploadIdCardModal;
    