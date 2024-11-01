import base64
import io
import numpy as np
from PIL import Image
import torch
from facenet_pytorch import MTCNN, InceptionResnetV1
from flask import Flask, request, jsonify

# Khởi tạo Flask app
app = Flask(__name__)

# Thiết lập thiết bị
device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')

# Khởi tạo MTCNN và InceptionResnetV1
mtcnn = MTCNN(keep_all=True, device=device)
resnet = InceptionResnetV1(pretrained='vggface2').eval().to(device)

# Hàm để giải mã hình ảnh từ chuỗi base64
def decode_base64_and_get_image(base64_str):
    base64_str = base64_str.split(',')[1]  # Loại bỏ phần header
    image_data = base64.b64decode(base64_str)
    return Image.open(io.BytesIO(image_data))

# Hàm để lấy embedding từ gương mặt
def get_face_embedding(image):
    image = mtcnn(image)  # Phát hiện gương mặt và cắt xén
    if image is not None:
        embedding = resnet(image)  # Trích xuất nhúng
        return embedding
    return None

# Hàm để so sánh nhúng
def is_same_person(embedding1, embedding2, threshold=0.8):
    distance = torch.dist(embedding1, embedding2).item()
    return distance < threshold

@app.route('/api/face/compare', methods=['POST'])
def compare_faces():
    data = request.json
    if 'image1' not in data or 'image2' not in data:
        return jsonify({"error": "Missing images"}), 400

    # Giải mã hình ảnh từ base64
    image1 = decode_base64_and_get_image(data['image1'])
    image2 = decode_base64_and_get_image(data['image2'])

    # Lấy embedding từ hai hình ảnh
    embedding1 = get_face_embedding(image1)
    embedding2 = get_face_embedding(image2)

    if embedding1 is None or embedding2 is None:
        return jsonify({"error": "Face not detected in one or both images"}), 400

    # So sánh nhúng
    same_person = is_same_person(embedding1, embedding2)

    return jsonify({"same_person": same_person})

if __name__ == '__main__':
    app.run(debug=True)
