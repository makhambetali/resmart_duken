from app.models import CashFlow
class CashFlowDAO:
    def get_cashflows_by_date(self, date):
        queryset = CashFlow.objects.all().filter(date_added__date = date).order_by('-date_added')
        return queryset
