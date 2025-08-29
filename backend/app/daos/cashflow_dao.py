from app.models import CashFlow
from django.core.cache import cache
from django.db.models import Q
class CashFlowDAO:
    def get_cashflows_by_date(self, date, flow_type):
        flow_type_to_logic = {
            'income': Q(amount__gt = 0),
            'expense': Q(amount__lt = 0)
        }
        query = Q(date_added__date = date)
        query &= flow_type_to_logic.get(flow_type, Q())
        queryset = CashFlow.objects.all().filter(query).order_by('-date_added')
        return queryset
