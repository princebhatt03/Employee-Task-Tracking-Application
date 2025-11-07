# -------------------------
# Frontend Dockerfile
# -------------------------
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend source files
COPY . .

# Build Vite app
RUN npm run build

# -------------------------
# Production Nginx server
# -------------------------
FROM nginx:alpine

# Copy build output from Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
