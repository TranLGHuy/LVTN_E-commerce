import json
import numpy as np
import requests
from PIL import Image
import io
from facenet_pytorch import MTCNN, InceptionResnetV1
import torch
import cv2
from pymongo import MongoClient

# Thiết lập thiết bị
device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
print('Running on device: {}'.format(device))

# Khởi tạo MTCNN và InceptionResnetV1
mtcnn = MTCNN(keep_all=True, device=device)
resnet = InceptionResnetV1(pretrained='vggface2').eval().to(device)

# Hàm để lấy embedding từ gương mặt
def get_face_embedding(image):
    if image is None:
        return None
    # Ensure the image is RGB
    if image.shape[-1] == 4:
        image = Image.fromarray(image).convert('RGB')
        image = np.array(image)
    
    # Detect face and compute embedding
    boxes, _ = mtcnn.detect(image)
    if boxes is not None:
        face = mtcnn(image)
        if face is not None:
            embedding = resnet(face)
            return embedding
    return None

# Hàm tải hình ảnh từ URL
def load_image_from_url(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        image = Image.open(io.BytesIO(response.content)).convert('RGB')
        return np.array(image)
    except Exception as e:
        print(f"Error loading image from URL: {e}")
        return None

# Kết nối đến MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['ecommerce']
collection = db['sellers']

# Khởi động camera
cap = cv2.VideoCapture(0)

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        camera_embedding = get_face_embedding(frame_rgb)

        # Lấy danh sách sellers từ MongoDB
        sellers = collection.find()
        matches_found = []

        for seller_info in sellers:
            # Kiểm tra nếu trường faceImage tồn tại
            if 'faceImage' in seller_info and seller_info['faceImage']:
                cloudinary_image_url = seller_info['faceImage']
                saved_image = load_image_from_url(cloudinary_image_url)

                # Lấy embedding từ hình ảnh gương mặt đã tải
                saved_embedding = get_face_embedding(saved_image)

                # So sánh nếu camera có gương mặt
                if camera_embedding is not None and saved_embedding is not None:
                    # Calculate Euclidean distance
                    distance = torch.norm(saved_embedding - camera_embedding).item()

                    # Xác định ngưỡng
                    threshold = 0.7
                    if distance < threshold:
                        print(f"Match found for seller: {seller_info['email']}")
                        matches_found.append(seller_info)

        # Hiển thị kết quả
        if matches_found:
            for idx, match in enumerate(matches_found):
                cv2.putText(frame, f"Match Found: {match['email']}", (10, 70 + 30 * idx),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        else:
            cv2.putText(frame, "No Match", (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

        # Hiển thị khung hình
        cv2.imshow('Camera', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("Exiting program.")
            break
finally:
    cap.release()
    cv2.destroyAllWindows()
    client.close() 
