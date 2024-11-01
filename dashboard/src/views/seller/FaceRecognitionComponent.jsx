import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { compareFaces } from '../../store/Reducers/faceReducer';

const FaceRecognitionComponent = () => {
  const dispatch = useDispatch();
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const { match, loading, error } = useSelector((state) => state.faceRecognition);

  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result.split(',')[1]);  // Mã hóa base64
    reader.readAsDataURL(file);
  };

  const handleCompareFaces = () => {
    if (image1 && image2) {
      dispatch(compareFaces({ image1, image2 }));
    }
  };

  return (
    <div>
      <h2>So sánh khuôn mặt</h2>
      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setImage1)} />
      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setImage2)} />
      <button onClick={handleCompareFaces} disabled={loading}>
        {loading ? 'Đang so sánh...' : 'So sánh'}
      </button>
      {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}
      {match !== null && <p>{match ? 'Khuôn mặt trùng khớp' : 'Khuôn mặt không trùng khớp'}</p>}
    </div>
  );
};

export default FaceRecognitionComponent;
