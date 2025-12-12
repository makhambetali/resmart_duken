from django.db.models import Q
from django.utils import timezone
from typing import Optional
from django.core.cache import cache
from app.models import Supply

class SupplyDAO:
    def get_past_supplies(self, supplier_name=None):
        """Поставки с delivery_date раньше текущей даты."""
        queryset = Supply.objects.filter(
            delivery_date__lt=timezone.now().date()
        ).select_related('supplier')

        if supplier_name:
            queryset = queryset.filter(supplier__name__iexact=supplier_name)

        return queryset

    def get_future_supplies(self, supplier_name=None):
        """Поставки с delivery_date сегодня или позже."""
        queryset = Supply.objects.filter(
            delivery_date__gte=timezone.now().date()
        ).select_related('supplier')

        if supplier_name:
            queryset = queryset.filter(supplier__name__iexact=supplier_name)

        return queryset

    
    def get_supplies_by_date(self, date, only_confirmed: bool = True, payment_type = 'all'):
        """Поставки на конкретную дату с опциональным фильтром по confirmed."""
        payment_type_to_logic = {
            'cash': ~Q(price_cash = 0) & Q(price_bank = 0),
            'bank': ~Q(price_bank = 0) & Q(price_cash = 0),
            'mix': ~Q(price_cash=0) & ~Q(price_bank=0)
        }
        query = Q(delivery_date=date)
        if only_confirmed:
            query &= Q(is_confirmed=True)
        
        query &= payment_type_to_logic.get(payment_type, Q())

        queryset =Supply.objects.filter(query).select_related('supplier')
        return queryset

   