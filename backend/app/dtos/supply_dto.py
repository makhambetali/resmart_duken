from dataclasses import dataclass
from datetime import datetime
from typing import Optional
@dataclass
class SupplyDTO:
    id: int
    supplier_id:int 
    supplier: str
    price_cash: int
    price_bank: int
    bonus: int
    exchange: int
    delivery_date: datetime
    status: str
    arrival_date: Optional[str] 
    comment: Optional[str]