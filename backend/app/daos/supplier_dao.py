from django.core.cache import cache
from django.db.models import QuerySet
from typing import List
from app.models import Supplier
class SupplierDAO:
    def search(self, query: str) -> QuerySet[Supplier]:
        """Поставки с delivery_date раньше текущей даты."""
        queryset = Supplier.objects.all().order_by('-last_accessed')
        if query:
            return queryset.filter(name__icontains = query)
        
        return queryset
    
    def set_everydays(self, ids: List[int] = []):
        # ids_in_db = set(Supplier.objects.filter(is_everyday_supply=True).values_list('id', flat=True))
        ids_in_db = set(cache.get('everyday_supplies', []))
        ids_set = set(ids)
        trash_ids = ids_in_db - ids_set
        new_ids = ids_set - ids_in_db
        Supplier.objects.filter(id__in=new_ids).update(is_everyday_supply=True)
        Supplier.objects.filter(id__in=trash_ids).update(is_everyday_supply=False)
        print(ids_set, trash_ids)
        cache.set('everyday_supplies', ids_set)

