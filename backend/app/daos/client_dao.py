from app.models import ClientDebt, Client   

from rest_framework.serializers import ValidationError
class ClientDAO:
    def delete_all_debts(self, client: Client):
        client.debts.all().delete()

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
        return client

    def create_debt(self, client, debt_value):
        ClientDebt.objects.create(client=client, debt_value=debt_value)

    def get_debts(self, client):
        return client.debts.all().order_by('-date_added')
    
    def search(self, query=None):
        queryset = Client.objects.all()
        if query:
            queryset = queryset.filter(name__icontains=query)
        
        return queryset

