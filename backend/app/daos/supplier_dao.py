from django.core.cache import cache
from django.db.models import QuerySet
from typing import List, Optional
from app.models import Supplier
class SupplierDAO:
    def search(self, query: str, is_every_day_supply: Optional[bool] = None, self_arg = None) -> QuerySet[Supplier]:
        """Поставки с delivery_date раньше текущей даты."""
        queryset = Supplier.objects.filter(valid = True, store=self_arg.request.user.profile.store).order_by('-last_accessed')
        if query:
            queryset = queryset.filter(name__icontains=query.lower())
        if is_every_day_supply is not None:
            queryset = queryset.filter(is_everyday_supply=is_every_day_supply)
        return queryset
        
   