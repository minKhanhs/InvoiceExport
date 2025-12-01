# 🧾 Hệ Thống Quản Lý & Xuất Hóa Đơn (InvoicePro)

Hệ thống quản lý hóa đơn tự động với giao diện hiện đại, hỗ trợ thống kê doanh thu trực quan, tạo hóa đơn động và xuất PDF chuyên nghiệp.

---

## 🚀 Tính Năng Nổi Bật

- **Dashboard Hiện Đại:** Giao diện phong cách Momo/Fintech với tông màu Gradient Pink.
- **Biểu Đồ Thông Minh:** Thống kê doanh thu theo thời gian thực (Tuần, Tháng, Năm) sử dụng Area Chart với bộ lọc thời gian (Slicer).
- **Quản Lý Hóa Đơn:** Tạo, sửa, xoá hóa đơn với form nhập liệu dynamic (thêm/bớt dòng sản phẩm).
- **Xuất PDF:** Tích hợp Puppeteer để render hóa đơn ra PDF chuẩn A4, hỗ trợ xem trước (Preview) trên trình duyệt mà không cần tải về.
- **Dockerized:** Đóng gói Backend, Frontend và Database bằng Docker, triển khai chỉ với 1 lệnh.

---

## 🛠️ Công Nghệ Sử Dụng

### **Frontend**
- Framework: **React (Vite)**
- Styling: **Tailwind CSS** (Responsive, Gradient UI)
- Icons: **Lucide React**
- Charts: **Recharts** (Area Chart, Responsive Container)
- HTTP Client: **Axios**

### **Backend**
- Core: **Node.js, Express**
- Database: **PostgreSQL**
- PDF Engine: **Puppeteer** (Headless Chrome cho Alpine Linux)

### **DevOps**
- Container: **Docker, Docker Compose**
- Server: **Alpine Linux** (tối ưu dung lượng container Backend)

---

## ⚙️ Hướng Dẫn Cài Đặt & Chạy (Development)

### **1. Yêu Cầu Tiên Quyết**
- Máy tính đã cài **Docker Desktop**
- **Git**

---

### **2. Các Bước Thực Hiện**

#### **Bước 1: Clone dự án**
```bash
git clone <link-repo-cua-ban>
cd InvoiceExport
```
#### **Bước 2: Cấu hình biến môi trường**


Tạo file backend/.env và frontend/.env đúng nội dung
download các thư viện và công cụ npm install ở cả backend và frontend


#### **Bước 3: Khởi chạy hệ thống bằng Docker**

Tại thư mục chứa ```docker-compose.yml```:
```
# Khởi động lại docker
docker rm -f invoice-postgres invoice-backend invoice-frontend (nếu có trước đó)
docker compose down
docker compose build --no-cache
docker compose up -d
```

#### **Bước 4: Truy cập ứng dụng**

Chờ Database khởi tạo ~10–20 giây.
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 📂 Cấu Trúc Dự Án
```
InvoiceExport/
├── docker-compose.yml      # Orchestration cho toàn bộ hệ thống
├── .gitignore              # Git ignore rules
├── backend/                # Server Node.js
│   ├── Dockerfile          # Config Docker cài sẵn Chromium/Puppeteer
│   ├── .dockerignore
│   ├── src/
│   │   ├── controllers/    # Logic xử lý API (Invoice, PDF Export)
│   │   ├── services/       # Giao tiếp trực tiếp với DB
│   │   └── templates/      # Mẫu HTML Invoice để xuất PDF
│   └── ...
└── frontend/               # Client React.js
    ├── Dockerfile          # Config Docker Node Alpine
    ├── .dockerignore
    ├── src/
    │   ├── components/     # UI Components (Button, Modal Preview, Card...)
    │   ├── pages/          # Dashboard, List, Create...
    │   └── layouts/        # Sidebar, Header
    └── ...

```

## 🌍 Hướng Phát Triển Lên Production (Deploy) (có thể chuyển database lên cloud nếu sửa lại backend)
### Giai đoạn 1: Chuẩn bị Server
- Thuê VPS (Ubuntu 20.04/22.04)
- Cài Docker & Docker Compose
### Giai đoạn 2: Tối ưu Docker cho Production
Frontend
- Sử dụng multi-stage build:

-- Build React → file tĩnh (npm run build)

-- Dùng Nginx để serve các file này

Backend

- Thiết lập: NODE_ENV=production

- Bật Docker restart policy: always

### Giai đoạn 3: Triển khai
```
docker compose up -d --build
```

### Giai đoạn 4: Domain & SSL

- Dùng Nginx Reverse Proxy để map domain:

-- myinvoice.com → Frontend (5173)

-- api.myinvoice.com → Backend (3000)

- Cài SSL miễn phí với Certbot – Let’s Encrypt


