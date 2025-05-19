from django.db.models import Q, QuerySet

from app.models import Supplier

class SupplierDAO:
    def search(self, query: str) -> QuerySet[Supplier]:
        """Поставки с delivery_date раньше текущей даты."""
        queryset = Supplier.objects.all().order_by('-last_accessed')
        if query:
            return queryset.filter(name__icontains = query)
        
        return queryset