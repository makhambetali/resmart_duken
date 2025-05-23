from django.db.models import Q
from datetime import date
from typing import List, Optional

from app.daos.supply_dao import SupplyDAO
from app.dtos.supply_dto import SupplyDTO
from app.models import Supply
from app.services.cache import CacheService

class SupplyService:
    def __init__(self, dao: Optional[SupplyDAO] = None):
        self.dao = dao or SupplyDAO()  # Инъекция зависимости для тестирования
        self.cache_service = CacheService()

    def get_supplies(self, supply_type: str) -> List[SupplyDTO]:
        key = f'all_supplies_{supply_type}'
        cache = self.cache_service.get_cache(key)
        if cache:
            return cache
        
        queryset = (
            self.dao.get_past_supplies() if supply_type == 'past'
            else self.dao.get_future_supplies()
        )
        result = [self._to_dto(supply) for supply in queryset]
        self.cache_service.set_cache(key, result)
        return result

    def get_supplies_by_date(
        self, 
        target_date: date = None, 
        only_confirmed: bool = True
    ) -> List[SupplyDTO]:
        """Возвращает поставки на указанную дату."""
        target_date = target_date or date.today()
        key = f"supplies_by_date_{target_date}_{only_confirmed}"
        cache = self.cache_service.get_cache(key)
        if cache:
            return cache
        
        supplies = self.dao.get_supplies_by_date(target_date, only_confirmed)
        result = [self._to_dto(supply) for supply in supplies]
        self.cache_service.set_cache(key, result)
        return result

    def _to_dto(self, supply: Supply) -> SupplyDTO:
        """Конвертирует модель Supply в SupplyDTO."""
        return SupplyDTO(
            id=supply.id,
            supplier_id=supply.supplier.id,
            supplier=supply.supplier.name,
            price_cash=supply.price_cash,
            price_bank=supply.price_bank,
            bonus=supply.bonus,
            exchange=supply.exchange,
            delivery_date=supply.delivery_date,
            is_confirmed=supply.is_confirmed,
            arrival_date=supply.arrival_date,
            comment=supply.comment
        )