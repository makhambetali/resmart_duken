from django.db.models import Q
from django.utils import timezone
from typing import Optional
from django.core.cache import cache
from app.models import Supply

class SupplyDAO:
    def get_past_supplies(self):
        """Поставки с delivery_date раньше текущей даты."""
        queryset = cache.get_or_set(
            'supplies_past',
            lambda: Supply.objects.filter(delivery_date__lt=timezone.now().date()).select_related('supplier'),
            timeout=300
        )
        return queryset

    def get_future_supplies(self):
        """Поставки с delivery_date сегодня или позже."""
        queryset = cache.get_or_set(
            'supplies_future',
            lambda: Supply.objects.filter(delivery_date__gte=timezone.now().date()).select_related('supplier'),
            timeout=300
        )
        return queryset
    
    def get_supplies_by_date(self, date, only_confirmed: bool = True):
        """Поставки на конкретную дату с опциональным фильтром по confirmed."""
        query = Q(delivery_date=date)
        if only_confirmed:
            query &= Q(is_confirmed=True)

        queryset = cache.get_or_set(
            f'supplies_{query}',
            lambda: Supply.objects.filter(query).select_related('supplier'),
            timeout=300
        )
        return queryset

   