from app.models import Supplier, Supply
class SupplierService:
    def search(self, query=None):
        queryset = Supplier.objects.all().order_by('-last_accessed')
        if query:
            return queryset.filter(name__icontains = query)
        
        return queryset
    
    def get_supplies(self, supplier_id = None):
        queryset = Supply.objects.all().filter(supplier_id = supplier_id)
        return queryset