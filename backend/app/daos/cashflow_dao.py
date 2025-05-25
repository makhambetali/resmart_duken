from app.models import CashFlow
from django.core.cache import cache
class CashFlowDAO:
    def get_cashflows_by_date(self, date):
        queryset = cache.get_or_set(
            f'cashflow_{date}',
            lambda: CashFlow.objects.all().filter(date_added__date = date).order_by('-date_added'),
            timeout=300
        )
        return queryset
