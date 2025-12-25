from app.daos.client_dao import ClientDAO
from app.dtos.client_dto import ClientDTO, DebtDTO
from typing import Optional, List
from app.models import ClientDebt, Client
from rest_framework.serializers import ValidationError
import logging
from datetime import timedelta
from django.db.models import F, ExpressionWrapper, DurationField
logger = logging.getLogger('app')

class ClientService:
    def __init__(self, dao: Optional[ClientDAO] = None):
        self.dao = dao or ClientDAO()

    def apply_debt_change(self, client, debt_value, responsible_employee_id):
        if debt_value == 0:
            raise ValidationError("Сумма не должна быть равна нулю")
        
        if not responsible_employee_id:
            raise ValidationError("Не указано ответственное лицо")
        if client.debt >= 0:
            if debt_value > 0:
                self.dao.create_debt(client, debt_value, responsible_employee_id)
            else:
                remaining_amount = abs(debt_value)
                self.dao.allocate_payment(client, remaining_amount, responsible_employee_id)

        else:
            # client.debt < 0 — у клиента есть кредит
            if debt_value > 0:
                self.dao.apply_purchase_with_credit(
                    client,
                    debt_value,
                    responsible_employee_id
                )
            else:
                # клиент возвращает ещё деньги — увеличиваем кредит
                remaining_amount = abs(debt_value)
                self.dao.allocate_payment(client, remaining_amount, responsible_employee_id)

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
        # print('service:', show_zeros)
        search_results = self.dao.search(query, show_zeros)
        return [self._to_client_dto(result) for result in search_results]
    
    def delete_debt_by_id(self, debt_id: int) -> ClientDTO:
        try:
            client = self.dao.delete_debt_by_id(debt_id)
            
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
            last_accessed=client.last_accessed,
        )

    def _to_debt_dto(self, debt: ClientDebt) -> DebtDTO:
        return DebtDTO(
            id = debt.id, 
            debt_value=debt.debt_value,
            responsible_employee_id= debt.responsible_employee_id,
            # client = debt.client.name,
            date_added = debt.date_added,
            is_valid = debt.is_valid,
            description=debt.description
        )

class ClientStats:
    def __init__(self, client):
        self.client = client

    def get_debts(self):
        return ClientDebt.objects.filter(client = self.client)
    
    def get_time_to_payback_list(self) -> List[timedelta]:
        qs = (
            self.get_debts()
            .filter(repaid_at__isnull=False)
            .annotate(
                payback_time=ExpressionWrapper(
                    F("repaid_at") - F("date_added"),
                    output_field=DurationField(),
                )
            )
            .values_list("payback_time", flat=True)
        )

        return list(qs)
    def get_time_to_payback_days(self) -> List[float]:
        return [
            round(td.total_seconds() / 86400, 2)
            for td in self.get_time_to_payback_list()
        ]

    def execute(self):
        lst_of_days = self.get_time_to_payback_days()
        return {'avg_time_to_payback_in_days' : sum(lst_of_days) / len(lst_of_days)}