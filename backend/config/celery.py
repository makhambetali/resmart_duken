from celery import Celery
from celery.schedules import crontab
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('config')
app.config_from_object('django.conf:settings', namespace='CELERY')

# Расписание
app.conf.beat_schedule = {
    'create-daily-supplies': {
        'task': 'app.tasks.create_daily_supplies',
        'schedule': crontab(hour=18, minute=31),  # Каждый день в 8:00 утра
    },
}
app.autodiscover_tasks()