from dataclasses import dataclass
from typing import Optional
@dataclass
class CashFlowDTO:
    id: int
    amount: int
    description: Optional[str]
    date_added: Optional[str]