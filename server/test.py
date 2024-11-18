from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
from PIL import Image
import numpy as np
import torch
from facenet_pytorch import MTCNN, InceptionResnetV1
from pymongo import MongoClient
import requests
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3001"}})

# Thiết lập thiết bị
device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
print('Running on device: {}'.format(device))

# Khởi tạo MTCNN và InceptionResnetV1
mtcnn = MTCNN(keep_all=True, device=device)
resnet = InceptionResnetV1(pretrained='vggface2').eval().to(device)

# Kết nối đến MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['ecommerce']
collection = db['sellers']

def get_face_embedding(image):
    if image is None:
        return None
    if image.shape[-1] == 4:
        image = Image.fromarray(image).convert('RGB')
        image = np.array(image)

    boxes, _ = mtcnn.detect(image)
    if boxes is not None:
        face = mtcnn(image)
        if face is not None and face.shape[0] > 0:
            embedding = resnet(face)
            return embedding
    return None

@app.route('/api/verify-face', methods=['POST'])
def verify_face():
    data = request.get_json()
    image_data = data.get('image')
    seller_id = data.get('sellerId')

    if not image_data or not seller_id:
        print("Invalid data received.")
        return jsonify({'success': False, 'message': 'Invalid data'}), 400

    # Chuyển đổi dữ liệu hình ảnh từ base64
    image_data = image_data.split(',')[1]
    image_data = base64.b64decode(image_data)

    image = Image.open(io.BytesIO(image_data))

    # Lưu ảnh gửi lên
    # image.save('camera_image.jpg')
    # print("Saved camera image as 'camera_image.jpg'")

    # Lấy embedding từ hình ảnh được gửi
    camera_embedding = get_face_embedding(np.array(image))

    # Tìm seller trong MongoDB
    try:
        seller_info = collection.find_one({"_id": ObjectId(seller_id)})  # Chuyển đổi seller_id thành ObjectId
    except Exception as e:
        print(f"Error finding seller: {e}")
        return jsonify({'success': False, 'message': 'Error retrieving seller from database.'}), 500

    # print(f"Seller Info: {seller_info}")

    if seller_info and 'faceImage' in seller_info and seller_info['faceImage']:
        cloudinary_image_url = seller_info['faceImage']
        print(f"Cloudinary Image URL: {cloudinary_image_url}")

        try:
            saved_image = Image.open(io.BytesIO(requests.get(cloudinary_image_url).content)).convert('RGB')
            # saved_image.save('faceImage.jpg')  # Lưu ảnh vào file
            # print("Saved seller face image as 'faceImage.jpg'")
        except Exception as e:
            print(f"Error loading or saving face image: {e}")
            return jsonify({'success': False, 'message': 'Error loading seller face image.'}), 500

        saved_embedding = get_face_embedding(np.array(saved_image))

        if camera_embedding is not None and saved_embedding is not None:
            distance = torch.norm(saved_embedding - camera_embedding).item()
            threshold = 0.7  
            if distance < threshold:
                print("Face verification successful.")
                return jsonify({'success': True, 'message': 'Face verification successful'})
            else:
                print("Face verification failed.")
                return jsonify({'success': False, 'message': 'Face verification failed'})

    return jsonify({'success': False, 'message': 'Seller not found or image not available.'})

if __name__ == '__main__':
    app.run(port=5001)
