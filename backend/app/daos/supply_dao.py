from django.db.models import Q
from django.utils import timezone
from typing import Optional
from django.core.cache import cache
from app.models import Supply

class SupplyDAO:
    def get_related_supplies(self, user):
        return Supply.objects.filter(
            store = user.profile.store
        ).select_related('supplier')

    def get_past_supplies(self, supplier_name=None, user = None):
        """Поставки с delivery_date раньше текущей даты."""
        queryset = self.get_related_supplies(user).filter(delivery_date__lte=timezone.localtime().date())

        if supplier_name:
            queryset = queryset.filter(supplier__name__iexact=supplier_name)

        return queryset

    def get_future_supplies(self, supplier_name=None, user = None):
        """Поставки с delivery_date сегодня или позже."""
        queryset = self.get_related_supplies(user).filter(delivery_date__gte=timezone.localtime().date())
        if supplier_name:
            queryset = queryset.filter(supplier__name__iexact=supplier_name)

        return queryset

    
    def get_supplies_by_date(self, date, only_confirmed: bool = True, payment_type = 'all', user = None):
        """Поставки на конкретную дату с опциональным фильтром по confirmed."""
        payment_type_to_logic = {
            'cash': ~Q(price_cash = 0) & Q(price_bank = 0),
            'bank': ~Q(price_bank = 0) & Q(price_cash = 0),
            'mix': ~Q(price_cash=0) & ~Q(price_bank=0)
        }
        query = Q(delivery_date=date)
        if only_confirmed:
            query &= Q(status='delivered')
        
        query &= payment_type_to_logic.get(payment_type, Q())

        queryset =Supply.objects.filter(query, store = user.profile.store).select_related('supplier')
        return queryset

   