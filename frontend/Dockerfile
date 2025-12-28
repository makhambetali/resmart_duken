FROM node:20-alpine

WORKDIR /app

ARG VITE_API_BASE_URL
ARG VITE_GEMINI_API_KEY

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY}

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN mkdir -p /frontend && cp -r dist/* /frontend/
# EXPOSE 5173
# CMD ["npm", "run", "preview", "--", "--host"]
