# Stage 1: Build the React app
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx nx build host --configuration=production

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/apps/host /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
