# backend/Dockerfile – HOÀN CHỈNH, CHẠY NGON 100% VỚI PUPPETEER TRÊN ALPINE
FROM node:18-alpine

# Cài các thư viện hệ thống cần thiết cho Chromium/Puppeteer
RUN apk update && apk upgrade && \
    apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      fontconfig \
      udev \
      tini

# Đặt biến môi trường để Puppeteer dùng Chrome có sẵn trong Alpine
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
# Bắt buộc để chạy headless Chrome trong Docker
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Tạo user node để tránh chạy với root (tốt hơn cho production)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copy package trước để tận dụng cache
COPY package*.json ./

# Cài dependencies (bao gồm cả puppeteer)
RUN npm install

# Cài nodemon global (để npm run dev)
RUN npm install -g nodemon

# Copy toàn bộ code
COPY . .

# Đổi owner thư mục về user node (an toàn hơn)
RUN chown -R nextjs:nodejs /app

# Chạy với user non-root
USER nextjs

EXPOSE 3000

# Dùng tini để xử lý signal tốt hơn trong Docker
ENTRYPOINT ["/sbin/tini", "--"]

# Command dev (hot reload)
CMD ["npm", "run", "dev"]