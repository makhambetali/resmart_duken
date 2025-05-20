from celery_app import app as celery_app  # Импортируем приложение Celery

__all__ = ('celery_app',)  # Чтобы Celery мог найти app