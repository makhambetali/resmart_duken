from dataclasses import dataclass
from typing import Optional
@dataclass
class ClientDTO:
    id: int
    name: str
    debt: int
    description: Optional[str]
    is_chosen: Optional[bool]
    last_accessed: Optional[str]

@dataclass
class DebtDTO:
    id: int
    client: str
    debt_value: int
    date_added: Optional[str]