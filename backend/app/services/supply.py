from django.utils import timezone
from django.db.models import Q
from datetime import date
from typing import List, Optional

from app.daos.supply_dao import SupplyDAO
from app.dtos.supply_dto import SupplyDTO
from app.models import Supply

# class SupplyService:
#     def get_supplies(self, supply_type):
#         today = timezone.now().date()
#         if supply_type == 'past':
#             return Supply.objects.filter(delivery_date__lt=today)
#         else:
#             return Supply.objects.filter(delivery_date__gte=today)
#     def get_supplies_by_date(self, date = timezone.now().date()):
#         queryset = Supply.objects.all().filter(Q(delivery_date = date) & Q(is_confirmed=True))
#         return queryset

class SupplyService:
    def __init__(self, dao: Optional[SupplyDAO] = None):
        self.dao = dao or SupplyDAO()  # Инъекция зависимости для тестирования

    def get_supplies(self, supply_type: str) -> List[SupplyDTO]:
        queryset = (
            self.dao.get_past_supplies() if supply_type == 'past'
            else self.dao.get_future_supplies()
        )
        return [self._to_dto(supply) for supply in queryset]
    def get_past_supplies(self) -> List[SupplyDTO]:
        """Возвращает завершённые поставки (delivery_date < сегодня)."""
        supplies = self.dao.get_past_supplies()
        return [self._to_dto(supply) for supply in supplies]

    def get_future_supplies(self) -> List[SupplyDTO]:
        """Возвращает запланированные поставки (delivery_date >= сегодня)."""
        supplies = self.dao.get_future_supplies()
        return [self._to_dto(supply) for supply in supplies]

    def get_supplies_by_date(
        self, 
        target_date: date = None, 
        only_confirmed: bool = True
    ) -> List[SupplyDTO]:
        """Возвращает поставки на указанную дату."""
        target_date = target_date or date.today()
        supplies = self.dao.get_supplies_by_date(target_date, only_confirmed)
        return [self._to_dto(supply) for supply in supplies]

    def confirm_supply(self, supply_id: int) -> SupplyDTO:
        """Подтверждает поставку и устанавливает arrival_date."""
        supply = self.dao.get_by_id(supply_id)
        supply.is_confirmed = True
        self.dao.save(supply)
        return self._to_dto(supply)

    def _to_dto(self, supply: Supply) -> SupplyDTO:
        """Конвертирует модель Supply в SupplyDTO."""
        return SupplyDTO(
            id=supply.id,
            supplier_id=supply.supplier.id,
            supplier=supply.supplier.name,  # Пример расширения данных
            price_cash=supply.price_cash,
            price_bank=supply.price_bank,
            bonus=supply.bonus,
            exchange=supply.exchange,
            delivery_date=supply.delivery_date,
            is_confirmed=supply.is_confirmed,
            arrival_date=supply.arrival_date,
            comment=supply.comment
        )