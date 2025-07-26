from app.models import ClientDebt, Client   
from django.core.cache import cache
from rest_framework.serializers import ValidationError
import logging

logger = logging.getLogger('app')

class ClientDAO:
    def delete_all_debts(self, client: Client):
        client.debts.all().delete()
        cache.delete(f'clients_{client.id}_debts')

    def delete_one_debt(self, debt_id: int) -> Client:
        """
        Удаляет долг и обновляет баланс клиента
        Возвращает обновленного клиента
        """
        instance = ClientDebt.objects.select_related('client').get(id=debt_id)
        client = instance.client
        client.debt -= instance.debt_value
        
        client.save()
        instance.delete()
        logger.info(f'Удаление долга в размере {instance.debt_value} у клиента #{client.id}({client.name})')
        cache.delete(f'clients_{client.id}_debts')
        return client

    def create_debt(self, client, debt_value):
        ClientDebt.objects.create(client=client, debt_value=debt_value)
        cache.delete(f'clients_{client.id}_debts')

    def get_debts(self, client):
        # queryset = client.debts.all().order_by('-date_added')
        queryset = cache.get_or_set(
                f'clients_{client.id}_debts',
                lambda: client.debts.all().order_by('-date_added'),
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
        print('dao:', show_zeros)
        if not show_zeros:
            queryset = queryset.exclude(debt = 0)
        if query:
            queryset = queryset.filter(name__icontains=query)
        
        return queryset
        

