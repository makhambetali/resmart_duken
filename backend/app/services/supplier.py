from app.models import Supplier

class SupplierService:
    def search(self, query=None):
        queryset = Supplier.objects.all().order_by('-last_accessed')
        if query:
            return queryset.filter(name__icontains = query)
        
        return queryset