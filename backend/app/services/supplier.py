from app.models import Supplier
from typing import Optional, List
from app.daos.supplier_dao import SupplierDAO
from app.dtos.supplier_dto import SupplierDTO
class SupplierService:
    def __init__(self, dao: Optional[SupplierDAO] = None):
        self.dao = dao or SupplierDAO()

    def search(self, query: str = None) -> List[SupplierDTO]:
        search_result = self.dao.search(query)
        return [self._to_dto(result) for result in search_result]
    
    def set_everydays(self, ids: List[int] = None) -> None:
        output = self.dao.set_everydays(ids)
        

    def _to_dto(self, supplier: Supplier) -> SupplierDTO:
        """Конвертирует модель Supplier в SupplierDTO."""
        return SupplierDTO(
            id=supplier.id,
            name=supplier.name,
            description=supplier.description,
            last_accessed=supplier.last_accessed
        )
