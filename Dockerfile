# Base stage
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json yarn.lock ./
# Cài đặt dependencies và bỏ qua bộ lọc version
RUN yarn install --ignore-engines 

# Dev stage
FROM base AS dev
ENV NODE_ENV=development
COPY . .
RUN yarn build 
CMD ["yarn", "dev"]
EXPOSE 3000

# Production dependencies stage
FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package*.json yarn.lock ./
# Chỉ cài dependencies production
RUN yarn install --production 

# Production stage
FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
# Sao chép dependencies production từ prod-deps
COPY --from=prod-deps /app/node_modules ./node_modules
# Sao chép thư mục được build từ dev
COPY --from=dev /app/dist ./dist
CMD ["node", "dist/main.js"]
EXPOSE 3000