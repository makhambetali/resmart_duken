from django.utils import timezone

from app.models import Supply

class SupplyService:
    def get_supplies(self, supply_type):
        today = timezone.now().date()
        if supply_type == 'past':
            return Supply.objects.filter(delivery_date__lt=today)
        else:
            return Supply.objects.filter(delivery_date__gte=today)