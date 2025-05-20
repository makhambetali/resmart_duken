import os
from celery import Celery

# Установите настройки Django для Celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('config')  # Имя проекта (папка с settings.py)

# Загрузите настройки Celery из settings.py (CELERY_*)
app.config_from_object('django.conf:settings', namespace='CELERY')

# Автоматически находите задачи в файлах tasks.py всех приложений
app.autodiscover_tasks()