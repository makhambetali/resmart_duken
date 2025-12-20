from app.models import Supplier, Supply
from typing import Optional, List
from app.daos.supplier_dao import SupplierDAO
from app.dtos.supplier_dto import SupplierDTO
from django.db.models.functions import Coalesce, Extract
from typing import Dict

from django.db.models import (
    Aggregate,
    FloatField,
    F,
    Avg,
    Min,
    Max,
    Count,
)

from datetime import time

def ms_to_time(ms: int) -> time:
    """
    ms — миллисекунды от начала суток (0 .. 86_399_999)
    """
    if ms is None:
        return None

    seconds = ms // 1000
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60

    return time(hour=hours, minute=minutes, second=secs)

# from app.services.cache import CacheService
class SupplierService:
    def __init__(self, dao: Optional[SupplierDAO] = None):
        self.dao = dao or SupplierDAO()
        # self.cache_service = CacheService()

    def search(self, query: str = None, is_every_day_supply: Optional[bool] = None) -> List[SupplierDTO]:
        search_result = self.dao.search(
            query=query, 
            is_every_day_supply=is_every_day_supply
        )
        return [self._to_dto(result) for result in search_result]


    def _to_dto(self, supplier: Supplier) -> SupplierDTO:
        """Конвертирует модель Supplier в SupplierDTO."""
        return SupplierDTO(
            id=supplier.id,
            name=supplier.name,
            supervisor=supplier.supervisor,
            supervisor_pn=supplier.supervisor_pn,
            representative=supplier.representative,
            representative_pn=supplier.representative_pn,
            delivery=supplier.delivery,
            delivery_pn=supplier.delivery_pn,
            description=supplier.description,
            last_accessed=supplier.last_accessed
        )


class Median(Aggregate):
    function = 'PERCENTILE_CONT'
    name = 'median'
    output_field = FloatField()
    template = '%(function)s(0.5) WITHIN GROUP (ORDER BY %(expressions)s)'


class SupplierStats:
    def __init__(self, supplier):
        self.supplier = supplier

    def execute(self) -> Dict:
        # -------- TOTAL PRICE --------
        total_price = (
            Coalesce(F("price_bank"), 0)
            + Coalesce(F("price_cash"), 0)
        )

        qs = Supply.objects.filter(
            supplier=self.supplier,
            is_confirmed=True,
        )

        # -------- PRICE STATS --------
        price_stats = qs.aggregate(
            min=Min(total_price),
            max=Max(total_price),
            avg=Avg(total_price),
            med=Median(total_price),
            count=Count("id"),
        )

        # -------- TIME (ms from start of day) --------
        arrival_time_ms = (
            Extract("arrival_date", "hour") * 3600000 +
            Extract("arrival_date", "minute") * 60000 +
            Extract("arrival_date", "second") * 1000
        )

        arrival_stats = qs.aggregate(
            min=Min(arrival_time_ms),
            max=Max(arrival_time_ms),
            avg=Avg(arrival_time_ms),
            med=Median(arrival_time_ms),
        )

        # -------- RESULT --------
        return {
            "price": {
                "min": float(price_stats["min"]) if price_stats["min"] is not None else 0.0,
                "max": float(price_stats["max"]) if price_stats["max"] is not None else 0.0,
                "avg": float(price_stats["avg"]) if price_stats["avg"] is not None else 0.0,
                "med": float(price_stats["med"]) if price_stats["med"] is not None else 0.0,
            },
            "count": price_stats["count"],
            "arrival_date": {
                # milliseconds from start of day
                "min": ms_to_time(int(arrival_stats["min"])) if arrival_stats["min"] is not None else None,
                "max": ms_to_time(int(arrival_stats["max"])) if arrival_stats["max"] is not None else None,
                "avg": ms_to_time(int(arrival_stats["avg"])) if arrival_stats["avg"] is not None else None,
                "med": ms_to_time(int(arrival_stats["med"])) if arrival_stats["med"] is not None else None,
            }
        }
