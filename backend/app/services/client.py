from app.serializers import ClientSerializer, ClientDebtSerializer
from app.models import ClientDebt, Client   
class ClientService:
    def _delete_all_debts(self, client):
        client.debts.all().delete()
        print('Все долги удалены')

    def delete_one_debt(self, debt_id):
        instance = ClientDebt.objects.get(id=debt_id)
        instance.client.debt -= instance.debt_value
        instance.client.save()
        instance.delete()

    def _create_debt(self, client, debt_value):
        ClientDebt.objects.create(client=client, debt_value=debt_value)

    def add_debt(self, client, debt_value):
        self._create_debt(client, debt_value)

        client.debt += debt_value
        if client.debt == 0:
            self._delete_all_debts(client)
        client.save()

        return ClientSerializer(client).data
    
    def get_debts(self, client):
        queryset = client.debts.all().order_by('-date_added')

        return ClientDebtSerializer(queryset, many=True).data
    
    def search(self, query=None, filter_tag='latest'):
        filter_dict = {
            'oldest': 'last_accessed',
            'latest': '-last_accessed',
            'max': '-debt',
            'min': 'debt'
        }

        order_field = filter_dict.get(filter_tag, '-last_accessed')  # безопасно с default

        queryset = Client.objects.all().order_by(order_field)
        if query:
            queryset = queryset.filter(name__icontains=query)
        
        return queryset

