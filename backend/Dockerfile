FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# install cả dev deps vì môi trường đang development
RUN npm install

# cài thêm nodemon (bắt buộc)
RUN npm install -g nodemon

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
