from app.models import ClientDebt, Client   
from django.core.cache import cache
from rest_framework.serializers import ValidationError
import logging
from django.utils import timezone
from django.db import transaction
from django.db.models import Sum

logger = logging.getLogger('app')

class ClientDAO:
    def delete_all_debts(self, client: Client):
        client.debts.all().update(is_valid = False)
        cache.delete(f'clients_{client.id}_debts')

    def delete_debt_by_id(self, debt_id: int) -> Client:
        """
        Удаляет долг и обновляет баланс клиента
        Возвращает обновленного клиента
        """
        instance = ClientDebt.objects.select_related('client').get(id=debt_id)
        client = instance.client
        client.debt -= instance.debt_value
        
        client.save()
        # instance.delete()
        instance.is_valid = False
        instance.repaid_at = timezone.localtime()
        print(timezone.localtime())
        instance.save()
        logger.info(f'Удаление долга в размере {instance.debt_value} у клиента #{client.id}({client.name})')
        cache.delete(f'clients_{client.id}_debts')
        return client

    def create_debt(self, client, debt_value, responsible_employee_id):
        ClientDebt.objects.create(client=client, debt_value=debt_value, responsible_employee_id = responsible_employee_id)
        cache.delete(f'clients_{client.id}_debts')

    def allocate_payment(self, client, payment_amount, responsible_employee_id):
        remaining_amount = payment_amount
        now = timezone.localtime()
        timestamp = now.strftime("%d.%m.%Y %H:%M")

        print(client.name, remaining_amount, responsible_employee_id)

        with transaction.atomic():
            debts = (
                client.debts
                .filter(is_valid=True)
                .order_by("date_added")
                .select_for_update()
            )

            if not debts.exists():

                return client
            
            for debt in debts:
                print(debt.debt_value)
                if remaining_amount <= 0:
                    break

                original_debt = debt.debt_value

                if debt.debt_value <= remaining_amount:
                    # Полное погашение
                    remaining_amount -= debt.debt_value
                    debt.debt_value = 0
                    debt.repaid_at = now
                    debt.is_valid = False

                    log = (
                        f"[{timestamp}] Долг полностью погашен "
                        f"при общем платеже {payment_amount:,} ₸."
                    )

                else:
                    # Частичное погашение
                    debt.debt_value -= remaining_amount

                    log = (
                        f"[{timestamp}] Частичное погашение: "
                        f"было {original_debt:,} ₸, "
                        f"стало {debt.debt_value:,} ₸. "
                        f"Общий платёж — {payment_amount:,} ₸."
                    )

                    remaining_amount = 0

                # дописываем историю, а не затираем
                if debt.description:
                    debt.description += "\n" + log
                else:
                    debt.description = log

                debt.responsible_employee_id = responsible_employee_id
                debt.save(
                    update_fields=[
                        "debt_value",
                        "repaid_at",
                        "is_valid",
                        "description",
                        "responsible_employee",
                    ]
                )



    def get_debts(self, client: Client, is_valid = True):
        # queryset = client.debts.all().order_by('-date_added')
        queryset = cache.get_or_set(
                f'clients_{client.id}_debts',
                lambda: client.debts.filter(is_valid = is_valid).order_by('-date_added'),
                timeout=10
            )
        return queryset
    
    def search(self, query=None, show_zeros = True):
        # queryset = cache.get_or_set(
        #     'clients',
        #     lambda: Client.objects.all(),
        #     timeout=300
        # )
        queryset = Client.objects.all()
        # print('dao:', show_zeros)
        if not show_zeros:
            queryset = queryset.exclude(debt = 0)
        if query:
            queryset = queryset.filter(name__icontains=query)
        
        return queryset
        

