from app.models import Supplier, Supply
from typing import Optional, List, Dict
from app.daos.supplier_dao import SupplierDAO
from app.dtos.supplier_dto import SupplierDTO
from django.db.models.functions import Coalesce, Extract
from typing import Dict
from collections import Counter

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


    return time(hour=hours, minute=minutes).strftime("%H:%M")

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

ARRIVAL_INTERVALS = {
    "08:00-10:00": (time(8, 0), time(10, 0)),
    "10:00-12:00": (time(10, 0), time(12, 0)),
    "12:00-15:00": (time(12, 0), time(15, 0)),
    "15:00-18:00": (time(15, 0), time(18, 0)),
    "18:00-21:00": (time(18, 0), time(21, 0)),
    "21:00-23:59": (time(21, 0), time(23, 59)),
}
class Median(Aggregate):
    function = 'PERCENTILE_CONT'
    name = 'median'
    output_field = FloatField()
    template = '%(function)s(0.5) WITHIN GROUP (ORDER BY %(expressions)s)'




class SupplierStats:
    def __init__(self, supplier):
        self.supplier = supplier

    # -------------------------
    # Base queryset
    # -------------------------
    def get_queryset(self):
        return Supply.objects.filter(
            supplier=self.supplier,
            is_confirmed=True,
        )

    # -------------------------
    # Price statistics
    # -------------------------
    def get_price_stats(self, qs) -> Dict:
        total_price = (
            Coalesce(F("price_bank"), 0) +
            Coalesce(F("price_cash"), 0)
        )

        stats = qs.aggregate(
            min=Min(total_price),
            max=Max(total_price),
            avg=Avg(total_price),
            med=Median(total_price),
            count=Count("id"),
            rescheduled_cnt=Max("rescheduled_cnt"),
        )

        count = stats["count"] or 1  # защита от деления на 0

        return {
            "min": float(stats["min"] or 0),
            "max": float(stats["max"] or 0),
            "avg": round(stats["avg"], 2) if stats["avg"] else 0.0,
            "med": float(stats["med"] or 0),
            "rescheduled_coef": round(stats["rescheduled_cnt"] / count, 2),
            "count": stats["count"],
        }

    # -------------------------
    # Arrival time statistics
    # -------------------------
    def get_arrival_time_stats(self, qs) -> Dict:
        arrival_time_ms = (
            Extract("arrival_date", "hour") * 3600000 +
            Extract("arrival_date", "minute") * 60000
        )

        stats = qs.aggregate(
            min=Min(arrival_time_ms),
            max=Max(arrival_time_ms),
            avg=Avg(arrival_time_ms),
            med=Median(arrival_time_ms),
        )

        return {
            "min": ms_to_time(int(stats["min"])) if stats["min"] else None,
            "max": ms_to_time(int(stats["max"])) if stats["max"] else None,
            "avg": ms_to_time(int(stats["avg"])) if stats["avg"] else None,
            "med": ms_to_time(int(stats["med"])) if stats["med"] else None,
        }

    # -------------------------
    # Arrival time prediction (TOP-3)
    # -------------------------
    def get_arrival_prediction(self, qs) -> List[Dict]:
        arrivals = qs.values_list("arrival_date", flat=True)

        counter = Counter()

        for dt in arrivals:
            if not dt:
                continue

            t = dt.time()
            for name, (start, end) in ARRIVAL_INTERVALS.items():
                if start <= t < end:
                    counter[name] += 1
                    break

        total = sum(counter.values())
        if total == 0:
            return []

        prediction = {
            interval: round(count / total * 100, 2)
            for interval, count in counter.items()
        }

        top_3 = sorted(
            prediction.items(),
            key=lambda x: x[1],
            reverse=True
        )[:3]

        return [
            {
                "interval": interval,
                "probability": probability,
            }
            for interval, probability in top_3
        ]

    # -------------------------
    # Public API
    # -------------------------
    def execute(self) -> Dict:
        qs = self.get_queryset()

        return {
            "price": self.get_price_stats(qs),
            "arrival_time": self.get_arrival_time_stats(qs),
            "arrival_prediction": self.get_arrival_prediction(qs),
        }
