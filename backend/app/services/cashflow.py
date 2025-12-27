from django.utils import timezone
from app.daos.cashflow_dao import CashFlowDAO
from app.dtos.cashflow_dto import CashFlowDTO
from app.models import CashFlow
from typing import Optional

class CashFlowService:
    def __init__(self, dao: Optional[CashFlowDAO] = None):
        self.dao = dao or CashFlowDAO()
    def get_cashflows_by_date(self, date, flow_type = 'all', user = None):
        cashflows = self.dao.get_cashflows_by_date(date, flow_type, user = user)
        return [self._to_dto(cashflow) for cashflow in cashflows]
    
    def _to_dto(self, cashflow: CashFlow) -> CashFlowDTO:
        return CashFlowDTO(
            id = cashflow.id,
            amount = cashflow.amount,
            description = cashflow.description,
            date_added = cashflow.date_added
        )