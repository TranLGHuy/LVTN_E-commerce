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

device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
mtcnn = MTCNN(keep_all=True, device=device)
resnet = InceptionResnetV1(pretrained='vggface2').eval().to(device)

client = MongoClient('mongodb://localhost:27017/')
db = client['ecommerce']
collection = db['sellers']

def get_face_embedding(image):
    if image.shape[-1] == 4:
        image = Image.fromarray(image).convert('RGB')
    boxes, _ = mtcnn.detect(image)
    if boxes is not None:
        face = mtcnn(image)
        if face is not None and face.shape[0] > 0:
            return resnet(face)
    return None

@app.route('/api/verify-face', methods=['POST'])
def verify_face():
    data = request.get_json()
    image_data, seller_id = data.get('image'), data.get('sellerId')
    if not image_data or not seller_id:
        return jsonify({'success': False, 'message': 'Invalid data'}), 400

    image = Image.open(io.BytesIO(base64.b64decode(image_data.split(',')[1])))

    camera_embedding = get_face_embedding(np.array(image))

    seller_info = collection.find_one({"_id": ObjectId(seller_id)})
    if not seller_info or 'faceImage' not in seller_info:
        return jsonify({'success': False, 'message': 'Seller not found or image not available.'}), 400

    try:
        saved_image = Image.open(io.BytesIO(requests.get(seller_info['faceImage']).content)).convert('RGB')
    except Exception as e:
        return jsonify({'success': False, 'message': 'Error loading seller face image.'}), 500

    saved_embedding = get_face_embedding(np.array(saved_image))

    if camera_embedding is not None and saved_embedding is not None:
        distance = torch.norm(saved_embedding - camera_embedding).item()
        if distance < 0.7:
            return jsonify({'success': True, 'message': 'Face verification successful'})
    
    return jsonify({'success': False, 'message': 'Face verification failed'})

if __name__ == '__main__':
    app.run(port=5001)
