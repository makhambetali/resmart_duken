from app.daos.client_dao import ClientDAO
from app.dtos.client_dto import ClientDTO, DebtDTO
from typing import Optional, List
from app.models import ClientDebt, Client
from django.db import transaction
from rest_framework.serializers import ValidationError
import logging

logger = logging.getLogger('app')

class ClientService:
    def __init__(self, dao: Optional[ClientDAO] = None):
        self.dao = dao or ClientDAO()

    def add_debt(self, client, debt_value, responsible_employee_id):
        if debt_value == 0:
            raise ValidationError("Сумма не должна быть равна нулю")
        
        if not responsible_employee_id:
            raise ValidationError("Не указано ответственное лицо")
        
        self.dao.create_debt(client, debt_value, responsible_employee_id)
        client.debt += debt_value
        logger.info(f'Создание долга в размере {debt_value} клиенту #{client.id}({client.name})')
        if client.debt == 0:
            self.dao.delete_all_debts(client)
            logger.info(f'Обнуление всех долгов клиента #{client.id}({client.name})')
        
        client.save()
        return self._to_client_dto(client)
    
    def get_debts(self, client: Client) -> List[ClientDTO]:
        all_debts = self.dao.get_debts(client)
        return [self._to_debt_dto(debt) for debt in all_debts]
    
    def search(self, query=None, show_zeros = True) -> List[ClientDTO]:
        print('service:', show_zeros)
        search_results = self.dao.search(query, show_zeros)
        return [self._to_client_dto(result) for result in search_results]
    
    def delete_one_debt(self, debt_id: int) -> ClientDTO:
        try:
            client = self.dao.delete_one_debt(debt_id)
            
            return self._to_client_dto(client)   # Получаем и удаляем долг, обновляем клиента
                
                
        except ClientDebt.DoesNotExist:
            raise
        except Exception as e:
            raise

    def _to_client_dto(self, client: Client) -> ClientDTO:
        return ClientDTO(
            id = client.id, 
            name = client.name,
            debt = client.debt,
            description=client.description,
            is_chosen=client.is_chosen,
            last_accessed=client.last_accessed
        )

    def _to_debt_dto(self, debt: ClientDebt) -> DebtDTO:
        return DebtDTO(
            id = debt.id, 
            debt_value=debt.debt_value,
            responsible_employee_id= debt.responsible_employee_id,
            # client = debt.client.name,
            date_added = debt.date_added
        )

