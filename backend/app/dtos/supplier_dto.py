from dataclasses import dataclass
from typing import Optional
@dataclass
class SupplierDTO:
    id: int
    name: str
    supervisor: Optional[str]
    supervisor_pn: Optional[str]
    representative: Optional[str]
    representative_pn: Optional[str]
    delivery: Optional[str]
    delivery_pn: Optional[str]
    description: Optional[str]
    last_accessed: Optional[str]
    