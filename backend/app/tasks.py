# # yourapp/tasks.py
# import logging
# from celery import shared_task
# from celery_app import app
# from django.utils import timezone
# from django.db import connection
# from app.models import Supplier, Supply

# logger = logging.getLogger(__name__)
# @app.task
# def print_message():
#     print("Сообщение: Celery работает! (Каждую минуту)")

# @app.task
# def auto_generate_supplies():
#     try:
#         # Принудительно открываем подключение
#         connection.connect()
        
#         suppliers = Supplier.objects.filter(is_everyday_supply=True)
#         delivery_date = timezone.now().date()
#         for supplier in suppliers:
#             Supply.objects.create(supplier=supplier, delivery_date=delivery_date)
        
#         print("Успешно создано")
#     except Exception as e:
#         print(f"Ошибка: {e}")
#     finally:
#         # Закрываем подключение
#         connection.close()

from celery import shared_task
from django.utils import timezone
from .models import Supplier, Supply
import logging

logger = logging.getLogger(__name__)

@shared_task
def create_daily_supplies():
    try:
        today = timezone.now().date()
        suppliers = Supplier.objects.filter(is_everyday_supply=True)
        
        created_count = 0
        for supplier in suppliers:
            # Проверяем, не была ли уже создана поставка сегодня
            if not Supply.objects.filter(supplier=supplier, created_at__date=today).exists():
                Supply.objects.create(
                    supplier=supplier,
                    # Другие обязательные поля вашей модели Supply
                )
                created_count += 1
        
        logger.info(f"Created {created_count} daily supplies for {suppliers.count()} suppliers")
        return f"Created {created_count} supplies"
    except Exception as e:
        logger.error(f"Error creating daily supplies: {str(e)}")
        raise