from celery import shared_task
from app.models import Supply, Supplier
import time
from django.utils import timezone
from datetime import timedelta

@shared_task
def create_everyday_supply():
    suppliers = Supplier.objects.filter(is_everyday_supply = True)
    print(f'Найдено {len(suppliers)}: {', '.join([supplier.name for supplier in suppliers])}')
    for supplier in suppliers:
        supply = Supply.objects.create(supplier = supplier, delivery_date = timezone.now().date()+timedelta(days=1))
        print(f'{supply} успешно создан')
    print("Периодическая задача выполняется!")
    return "Задача успешно выполнена."