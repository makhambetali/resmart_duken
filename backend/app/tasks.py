from celery import shared_task
from app.models import Supply, Supplier
import time
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q, F

@shared_task
def create_everyday_supply():
    suppliers = Supplier.objects.filter(is_everyday_supply = True)
    today = timezone.localdate()
    for supplier in suppliers:
        supply = Supply.objects.create(supplier = supplier, delivery_date = today)
        print(f'{supply} успешно создан')
    print("Периодическая задача выполняется!")
    return "Задача успешно выполнена."

@shared_task 
def shift_supply_to_the_next_day():
    today = timezone.localdate()
    supplies = Supply.objects.filter(delivery_date = today - timedelta(days=1), is_confirmed=False)
    supplies.update(
        delivery_date = today,
        rescheduled_cnt=F("rescheduled_cnt") + 1,
    )
    