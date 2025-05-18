from django.db.models import Q
from django.utils import timezone
from typing import Optional

from app.models import Supply

class SupplyDAO:
    def get_past_supplies(self):
        """Поставки с delivery_date раньше текущей даты."""
        return Supply.objects.filter(
            delivery_date__lt=timezone.now().date()
        ).select_related('supplier')

    def get_future_supplies(self):
        """Поставки с delivery_date сегодня или позже."""
        return Supply.objects.filter(
            delivery_date__gte=timezone.now().date()
        ).select_related('supplier')

    def get_supplies_by_date(self, date, only_confirmed: bool = True):
        """Поставки на конкретную дату с опциональным фильтром по confirmed."""
        query = Q(delivery_date=date)
        if only_confirmed:
            query &= Q(is_confirmed=True)
        return Supply.objects.filter(query).select_related('supplier')

    def get_by_id(self, supply_id: int):
        """Получает поставку по ID или выбрасывает исключение."""
        return Supply.objects.get(id=supply_id)

    def save(self, supply: Supply):
        """Сохраняет изменения в поставке."""
        supply.save()