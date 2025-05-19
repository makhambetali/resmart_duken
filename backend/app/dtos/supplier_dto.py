from dataclasses import dataclass
from typing import Optional
@dataclass
class SupplierDTO:
    id: int
    name: str
    description: Optional[str]
    last_accessed: Optional[str]