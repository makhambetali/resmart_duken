from app.serializers import ClientSerializer, ClientDebtSerializer
from app.models import ClientDebt, Client   
class ClientService:
    def _create_debt(self, client, debt_value):
        ClientDebt.objects.create(client=client, debt_value=debt_value)

    def add_debt(self, client, debt_value):
        self._create_debt(client, debt_value)

        client.debt += debt_value
        client.save()

        return ClientSerializer(client).data
    
    def get_debts(self, client):
        queryset = client.debts.all()

        return ClientDebtSerializer(queryset, many=True).data
    
    def search(self, query=None):
        queryset = Client.objects.all().order_by('-last_accessed')
        if query:
            return queryset.filter(name__icontains = query)
        
        return queryset
