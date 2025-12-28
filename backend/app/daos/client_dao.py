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
        instance.description = "Долг полностью погашен вручную."
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
            if remaining_amount > 0:
                self.create_debt(
                    client=client,
                    debt_value= -remaining_amount,  # отрицательный долг
                    responsible_employee_id=responsible_employee_id,
                )

    def apply_purchase_with_credit(self, client, purchase_amount, responsible_employee_id):
        """
        purchase_amount > 0
        client.debt < 0
        """
        now = timezone.localtime()
        timestamp = now.strftime("%d.%m.%Y %H:%M")

        with transaction.atomic():
            credit_debt = (
                client.debts
                .filter(is_valid=True, debt_value__lt=0)
                .select_for_update()
                .first()
            )

            if not credit_debt:
                # На всякий случай
                self.create_debt(client, purchase_amount, responsible_employee_id)
                return

            credit_amount = abs(credit_debt.debt_value)

            if purchase_amount < credit_amount:
                # 🔹 Кредит частично использован
                new_credit = credit_amount - purchase_amount
                credit_debt.debt_value = -new_credit

                log = (
                    f"[{timestamp}] Использована переплата клиента: "
                    f"{purchase_amount:,} ₸. "
                    f"Остаток переплаты — {new_credit:,} ₸."
                )

                credit_debt.description = (
                    credit_debt.description + "\n" + log
                    if credit_debt.description else log
                )

                credit_debt.save(update_fields=["debt_value", "description"])

            else:
                # 🔹 Кредит полностью использован
                credit_debt.debt_value = 0
                credit_debt.is_valid = False
                credit_debt.repaid_at = now

                log = (
                    f"[{timestamp}] Переплата клиента полностью использована "
                    f"при покупке на {purchase_amount:,} ₸."
                )

                credit_debt.description = (
                    credit_debt.description + "\n" + log
                    if credit_debt.description else log
                )

                credit_debt.save(
                    update_fields=["debt_value", "is_valid", "repaid_at", "description"]
                )

                remaining = purchase_amount - credit_amount
                if remaining > 0:
                    # создаём обычный долг
                    self.create_debt(
                        client,
                        remaining,
                        responsible_employee_id
                    )


    def get_debts(self, client: Client, is_valid = True):
        # queryset = client.debts.all().order_by('-date_added')
        queryset = cache.get_or_set(
                f'clients_{client.id}_debts',
                lambda: client.debts.all().order_by('-date_added'),
                timeout=10
            )
        return queryset
    
    def search(self, query=None, show_zeros = True, user = None):
        # queryset = cache.get_or_set(
        #     'clients',
        #     lambda: Client.objects.all(),
        #     timeout=300
        # )
        queryset = Client.objects.filter(store = user.profile.store)
        # print('dao:', show_zeros)
        if not show_zeros:
            queryset = queryset.exclude(debt = 0)
        if query:
            queryset = queryset.filter(name__icontains=query)
        
        return queryset
        

