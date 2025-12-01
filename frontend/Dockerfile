# Dùng node chính thức, chỉ 1 stage duy nhất
FROM node:20-alpine

# Thư mục làm việc
WORKDIR /app

# Copy package trước để cache
COPY package*.json ./
RUN npm ci

# Copy toàn bộ code frontend
COPY . .

# ─────────────────────────────────────────────────────
# LỰA CHỌN 1: Chỉ dùng khi bạn muốn production (khuyên dùng khi nộp đồ án)
# RUN npm run build
# EXPOSE 4173
# CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]

# ─────────────────────────────────────────────────────
# LỰA CHỌN 2: Dùng khi bạn đang code (hot reload) ← ĐANG DÙNG GIAI ĐOẠN NÀY
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]