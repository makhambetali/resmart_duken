import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('config')
app.config_from_object('django.conf:settings', namespace='CELERY')

app.conf.beat_schedule = {
    'say-hi-every-minute': {
        'task': 'app.tasks.auto_generate_supplies',
        'schedule': crontab(hour=0, minute=9 )
    },
}

app.autodiscover_tasks()