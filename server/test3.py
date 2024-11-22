from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from facenet_pytorch import MTCNN, InceptionResnetV1
from PIL import Image
import base64
import io
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3001"}}, supports_credentials=True)


# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['ecommerce']
collection = db['sellers']

# Load models
mtcnn = MTCNN()
resnet = InceptionResnetV1(pretrained='vggface2').eval()

def get_embedding(image):
    face = mtcnn(image)
    if face is not None:
        return resnet(face.unsqueeze(0)).detach()
    return None

@app.route('/verify-face', methods=['OPTIONS'])
def options():
    return jsonify({'status': 'ok'}), 200

def verify_face():
    data = request.get_json()
    captured_image_data = data['capturedImage'].split(',')[1]
    seller_id = data['sellerId']

    # Find seller in MongoDB by sellerId
    seller_info = collection.find_one({'_id': ObjectId(seller_id)})  # Ensure ObjectId
    if seller_info is None:
        return jsonify({'match': False, 'error': 'Seller not found'}), 404

    db_face_image_data = seller_info.get('faceImage')
    if not db_face_image_data:
        return jsonify({'match': False, 'error': 'Face image not found for the seller'}), 404

    captured_image = Image.open(io.BytesIO(base64.b64decode(captured_image_data)))
    db_face_image = Image.open(io.BytesIO(base64.b64decode(db_face_image_data.split(',')[1])))

    captured_embedding = get_embedding(captured_image)
    db_embedding = get_embedding(db_face_image)

    if captured_embedding is not None and db_embedding is not None:
        similarity = torch.cosine_similarity(captured_embedding, db_embedding).item()
        match = similarity > 0.8
        return jsonify({'match': match})
    else:
        return jsonify({'match': False, 'error': 'Face not detected in one or both images'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
