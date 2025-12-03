# Hệ Thống Quản Lý & Xuất Hóa Đơn (InvoicePro)

InvoicePro là ứng dụng Desktop lai (Hybrid App) giúp quản lý hóa đơn tự động với giao diện hiện đại, hỗ trợ thống kê doanh thu trực quan và xuất PDF chuyên nghiệp.

## 🚀 Tính Năng Nổi Bật

- **Dashboard Hiện Đại**: Giao diện phong cách Momo/Fintech với tông màu Gradient Pink.
- **Biểu Đồ Thông Minh**: Thống kê doanh thu theo thời gian thực (Tuần, Tháng, Năm) sử dụng Area Chart với bộ lọc thời gian.
- **Quản Lý Hóa Đơn**: Tạo, sửa, xoá hóa đơn với form nhập liệu dynamic (thêm/bớt dòng sản phẩm).
- **Xuất PDF & In Ấn**: Tích hợp Puppeteer để render hóa đơn chuẩn A4, hỗ trợ Xem trước (Preview) ngay trên App trước khi in.
- **Desktop Experience**: Chạy như phần mềm máy tính (file .exe), không cần mở trình duyệt.

## 🛠️ Công Nghệ Sử Dụng

| Hạng mục   | Công nghệ          | Chi tiết                              |
|------------|--------------------|---------------------------------------|
| App Client | Electron           | Đóng gói ứng dụng Desktop (Windows)   |
| Frontend   | React (Vite)       | UI/UX, Tailwind CSS, Lucide Icons, Recharts |
| Backend    | Node.js (Express)  | API xử lý nghiệp vụ                   |
| Database   | PostgreSQL         | Lưu trữ dữ liệu                       |
| PDF Engine | Puppeteer          | Headless Chrome (trên Alpine Linux)   |
| DevOps     | Docker             | Container hóa Backend & Database      |

## ⚙️ Hướng Dẫn Cài Đặt & Chạy (Development)

Quy trình phát triển gồm 2 phần: Chạy Server (Backend) và chạy App (Frontend).

### 1. Yêu Cầu Tiên Quyết

- Docker Desktop (Để chạy Backend & DB).
- Node.js (Để chạy môi trường phát triển App).
- Git.

### 2. Quy Trình Chạy Chi Tiết

**Bước 1: Clone dự án**

```bash
git clone <link-repo-cua-ban>
cd InvoiceExport
```

**Bước 2: Cấu hình biến môi trường (.env)**

Tạo file `.env` trong thư mục `backend/` với nội dung sau:

```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=invoice-postgres
DB_NAME=invoice
PORT=3000
# Đường dẫn Chromium cho Docker Alpine (BẮT BUỘC)
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

**Bước 3: Khởi động Backend & Database (Docker)**

Mở Terminal tại thư mục gốc, chạy lệnh:

```bash
# 1. Dọn dẹp container cũ (tránh lỗi trùng tên)
docker compose down

# 2. Build và khởi chạy Backend
docker compose up -d --build
```

Chờ khoảng 30s để Database khởi tạo xong.

**Bước 4: Khởi động Desktop App (Electron)**

Mở một Terminal mới, đi vào thư mục frontend và cài đặt thư viện:

```bash
cd frontend
npm install
```

Sau đó chạy lệnh khởi động App:

```bash
npm run electron:dev
```

Lúc này cửa sổ ứng dụng InvoicePro sẽ hiện lên.

## 📦 Hướng Dẫn Đóng Gói (Build .exe)

Để tạo ra file cài đặt `.exe` gửi cho người dùng cuối (Windows), làm theo các bước sau tại thư mục `frontend`:

1. **Dọn dẹp file rác (Powershell)**  
   Chạy lệnh này để xóa các bản build lỗi cũ (nếu có):  
   ```powershell
   Remove-Item -Recurse -Force dist, release
   ```

2. **Chạy lệnh đóng gói**  
   ```bash
   npm run electron:build
   ```

3. **Kết quả**  
   File cài đặt sẽ nằm tại: `frontend/release/InvoicePro Setup 1.0.0.exe`.

## 🌍 Hướng Phát Triển Backend Lên Production (VPS)

Để App có thể dùng chung dữ liệu qua mạng (thay vì chỉ localhost), bạn cần deploy Backend lên VPS.

### Giai đoạn 1: Chuẩn bị Server

- Thuê VPS (Ubuntu 20.04/22.04).
- Cài đặt Docker & Docker Compose.

### Giai đoạn 2: Tối ưu Docker Backend

- Trong `docker-compose.yml` trên Server, bỏ service frontend (vì đã chạy bằng App exe).
- Thiết lập `NODE_ENV=production`.
- Bật `restart: always`.

### Giai đoạn 3: Triển khai

Copy file `docker-compose.yml` và thư mục `backend` lên VPS, sau đó chạy:

```bash
docker compose up -d --build
```

### Giai đoạn 4: Cấu hình Domain & SSL

- Trỏ domain `api.myinvoice.com` về IP VPS.
- Dùng Nginx Reverse Proxy và Certbot để cài SSL (HTTPS).
- Cập nhật App: Sửa `API_URL` trong code Frontend trỏ về `https://api.myinvoice.com` rồi build lại file `.exe`.

## 📂 Cấu Trúc Dự Án

```
InvoiceExport/
├── docker-compose.yml      # Chỉ chứa Backend & Database
├── backend/                # Server API (Chạy trên Docker)
│   ├── Dockerfile          # Config môi trường Alpine + Chromium
│   └── src/
└── frontend/               # Desktop App Source
    ├── electron/           # Cấu hình Main Process (Cửa sổ App)
    ├── src/                # Giao diện React (Renderer Process)
    └── package.json        # Script build Electron
```