#!/bin/bash
set -e

echo "🚀 Начинаю деплой..."
cd /srv/resmart_duken

# 1. Обновляем код
echo "📥 Обновляю код..."
git fetch origin
git reset --hard origin/main

# 2. Пересобираем контейнеры
echo "🔨 Пересобираю контейнеры..."
docker-compose down
docker-compose build

# 3. Запускаем
echo "🚀 Запускаю сервисы..."
docker-compose up -d

# Ждем пока backend запустится
sleep 10

# 4. Миграции базы данных
echo "🗄️ Применяю миграции..."
docker exec resmart_duken_backend_1 python manage.py migrate --noinput

# 5. Собираем статику
echo "📁 Собираю статику..."
docker exec resmart_duken_backend_1 python manage.py collectstatic --noinput

# 6. Перезапускаем nginx
echo "🔄 Перезапускаю nginx..."
docker-compose restart nginx

echo "✅ Деплой завершен!"