from django.utils import timezone
from app.models import CashFlow
from app.serializers import CashFlowSerializer
class CashFlowService:
    def get_instance(self, date = timezone.now().date()):
        queryset = CashFlow.objects.all().filter(date_added__date = date)
        return CashFlowSerializer(queryset, many = True).data