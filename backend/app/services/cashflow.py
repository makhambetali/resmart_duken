from django.utils import timezone
from django.db.models import Sum
from app.models import CashFlow
from app.serializers import CashFlowSerializer
class CashFlowService:
    def get_instance(self, date = timezone.now().date()):
        queryset = CashFlow.objects.all().filter(date_added__date = date)
        return CashFlowSerializer(queryset, many = True).data
    
    def find_sum(self):
        total_today = CashFlow.objects\
            .filter(date_added__date=timezone.now().date())\
            .aggregate(total_sum=Sum('amount'))['total_sum']
        
        return total_today
