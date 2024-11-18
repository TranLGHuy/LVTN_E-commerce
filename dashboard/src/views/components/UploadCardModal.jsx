
    import React, { useRef, useState } from 'react';
    import Modal from 'react-modal';
    import { upload_id_card } from '../../store/Reducers/authReducer';
    import toast from 'react-hot-toast';
    import { useDispatch } from 'react-redux';
    Modal.setAppElement('#root');
    
    const UploadIdCardModal = ({ isOpen, onRequestClose, onUpload }) => {
        const dispatch = useDispatch();
        const frontFileRef = useRef(null);
        const backFileRef = useRef(null);
        const [selectedFrontImage, setSelectedFrontImage] = useState(null); // Preview for front image
        const [selectedBackImage, setSelectedBackImage] = useState(null);  // Preview for back image
    
        const handleFileChange = (e, setImage) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                setImage(URL.createObjectURL(file)); 
            }
        };
    
        const handleUpload = async () => {
            if (frontFileRef.current.files.length > 0 && backFileRef.current.files.length > 0) {
                const formData = new FormData();
                formData.append('id_image', frontFileRef.current.files[0]); 
                formData.append('id_image', backFileRef.current.files[0]);  
        
                try {
                    // Dispatching upload action
                    await dispatch(upload_id_card(formData)); 
                    onUpload();
                    onRequestClose(); 
                    toast.success("Upload thành công!");
                } catch (error) {
                    console.log(error)
                    toast.error("Upload thất bại.");
                }
            } else {
                toast.error("Vui lòng chọn đầy đủ ảnh mặt trước và mặt sau.");
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
                
                <div className="mb-4 w-full">
                    <label className="block text-sm font-medium mb-2">Ảnh mặt trước:</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setSelectedFrontImage)} 
                        className="mb-2 border border-gray-300 rounded-lg p-2 w-full"
                        ref={frontFileRef} 
                    />
                    {selectedFrontImage && (
                        <img 
                            src={selectedFrontImage} 
                            alt="Selected Front" 
                            className="mb-4 w-full h-auto rounded-lg"
                        />
                    )}
                </div>
    
                <div className="mb-4 w-full">
                    <label className="block text-sm font-medium mb-2">Ảnh mặt sau:</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setSelectedBackImage)} 
                        className="mb-2 border border-gray-300 rounded-lg p-2 w-full"
                        ref={backFileRef} 
                    />
                    {selectedBackImage && (
                        <img 
                            src={selectedBackImage} 
                            alt="Selected Back" 
                            className="mb-4 w-full h-auto rounded-lg"
                        />
                    )}
                </div>
    
                <div className="flex justify-between w-full">
                    <button 
                        onClick={onRequestClose} 
                        className="bg-gray-500 text-white rounded-lg px-4 py-2 hover:bg-gray-600"
                    >
                        Đóng
                    </button>
                    <button 
                        onClick={handleUpload} // Submit both images
                        className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
                    >
                        Gửi ảnh
                    </button>
                </div>
            </Modal>
        );
    };
    
    export default UploadIdCardModal;
    