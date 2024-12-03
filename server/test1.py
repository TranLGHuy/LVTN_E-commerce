import numpy as np
import matplotlib.pyplot as plt

# Tạo giá trị FAR từ 0.00 đến 0.08, với 5 điểm
far = np.array([0.00, 0.02, 0.04, 0.06, 0.08])

# Tạo giá trị TAR từ 0.0 đến 1.0, với 5 điểm tương ứng
tar = np.array([0.0, 0.2, 0.4, 0.6, 1.0])

# Vẽ đồ thị ROC
plt.figure(figsize=(8, 6))

# Đoạn đường ROC
plt.plot(far, tar, color='blue', lw=2, label='ROC curve')

# Thêm đường chéo tham khảo (đường ROC ngẫu nhiên)
plt.plot([0, 1], [0, 1], color='gray', linestyle='--')

# Thiết lập tiêu đề và nhãn cho trục
plt.title('Sơ đồ ROC')
plt.xlabel('Tỷ lệ chấp nhận sai (FAR)')
plt.ylabel('Tỷ lệ chấp nhận đúng (TAR)')

# Điều chỉnh nhãn cho trục X và Y sao cho khoảng cách đều
plt.xticks(np.linspace(0.00, 0.08, 5))  # Điều chỉnh trục X sao cho có 5 điểm đều
plt.yticks(np.linspace(0.0, 1.0, 6))   # Điều chỉnh trục Y sao cho có 6 điểm đều

# Hiển thị legend
plt.legend(loc='lower right')

# Hiển thị đồ thị
plt.grid(True)
plt.tight_layout()
plt.show()
