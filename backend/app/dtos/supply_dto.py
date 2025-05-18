from dataclasses import dataclass
from datetime import date, datetime
from typing import Optional
from django.utils import timezone

@dataclass
class SupplyDTO:
    id: int
    supplier_id: int
    supplier: str
    price_cash: int
    price_bank: int
    bonus: int
    exchange: int
    delivery_date: date
    is_confirmed: bool
    comment: Optional[str] = None  # Поле с default должно быть после обязательных
    arrival_date: Optional[str] = None  # Поле с default в конце
    
    def __post_init__(self):
        if self.arrival_date and timezone.is_naive(self.arrival_date):
            self.arrival_date = timezone.make_aware(self.arrival_date)
    
    # def __ge