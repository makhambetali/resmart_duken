# myproject/celery.py

import os
from celery import Celery

# Устанавливаем переменную окружения, чтобы Celery знал, где искать настройки Django.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Создаем экземпляр приложения Celery.
app = Celery('config')

# Загружаем конфигурацию из файла settings.py.
# 'CELERY_' — это префикс для всех настроек Celery.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Автоматически находим файлы tasks.py во всех приложениях Django.
app.autodiscover_tasks()