# yourapp/tasks.py
import logging
from celery import shared_task
from celery_app import app
from django.utils import timezone
from django.db import connection
from app.models import Supplier, Supply

logger = logging.getLogger(__name__)
@app.task
def print_message():
    print("Сообщение: Celery работает! (Каждую минуту)")

@app.task
def auto_generate_supplies():
    try:
        # Принудительно открываем подключение
        connection.connect()
        
        suppliers = Supplier.objects.filter(is_everyday_supply=True)
        delivery_date = timezone.now().date()
        for supplier in suppliers:
            Supply.objects.create(supplier=supplier, delivery_date=delivery_date)
        
        print("Успешно создано")
    except Exception as e:
        print(f"Ошибка: {e}")
    finally:
        # Закрываем подключение
        connection.close()