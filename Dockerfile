FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Сначала копируем только requirements.txt для лучшего кэширования
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Затем копируем остальные файлы проекта (исключая то, что в .dockerignore)
COPY backend ./backend
COPY frontend ./frontend

