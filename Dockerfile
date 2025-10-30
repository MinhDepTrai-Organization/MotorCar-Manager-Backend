# Base stage
FROM node:22-alpine AS base
WORKDIR /app
# Cài đặt công cụ biên dịch cho Alpine Linux
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci
# Cài đặt và rebuild binding
RUN npm install @css-inline/css-inline-linux-x64-musl
RUN npm rebuild @css-inline/css-inline --update-binary

# Dev stage
FROM base AS dev
ENV NODE_ENV=development
COPY . .
RUN npm run build
CMD ["npm", "run", "dev"]

# Production stage
FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
# Copy package.json và node_modules từ stage base
COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
# Copy dist từ stage dev
COPY --from=dev /app/dist ./dist
CMD ["node", "dist/main.js"]