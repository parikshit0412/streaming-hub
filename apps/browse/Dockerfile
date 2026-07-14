# Stage 1: Build the Vue app
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx nx build browse --configuration=production

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/apps/browse /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
