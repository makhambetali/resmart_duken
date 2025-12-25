from django.views.generic.base import TemplateView
from django.utils import timezone
from django.core.cache import cache
from django.http import JsonResponse
from datetime import date
from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from .serializers import *
from .pagination import SupplierResultsPaginationPage
from .models import *
from .services.supply import SupplyService
from .services.supplier import SupplierService, SupplierStats
from .services.client import ClientService, ClientStats
from .services.cashflow import CashFlowService

import logging

logger = logging.getLogger('app')

def getServerTime(request):
    return JsonResponse(
        {"server_time": timezone.localtime()},
        status=200
    )
class SupplierViewSet(viewsets.ModelViewSet):
    serializer_class = SupplierSerializer
    pagination_class = SupplierResultsPaginationPage
    service_layer = SupplierService()
    queryset = Supplier.objects.all().exclude(name="[удаленный поставщик]").order_by('-last_accessed')
    front_bool_to_back  = {
        'true':True,
        'false': False,
        'all': None
    }
    def get_queryset(self):
        q = self.request.query_params.get('q', None)
        ies = self.front_bool_to_back[self.request.query_params.get('is_everyday_supply', 'all')] #ies - stands for abbreviaton of is_everyday_supply
        suppliers_dto = self.service_layer.search(q, ies)
        return self.queryset.filter(id__in=[dto.id for dto in suppliers_dto])
    
    def perform_create(self, serializer):
        cache.delete('suppliers')
        return super().perform_create(serializer)
    
    @action(detail = True, methods = ['get'])
    def get_stats(self, request, pk = None):
        supplier_obj = self.get_object()
        anal = SupplierStats(supplier_obj)
        return JsonResponse(anal.execute())

    
    
class TestViewSet(viewsets.ModelViewSet):
    serializer_class = SupplierSerializer
    queryset = Supplier.objects.all()
        
    
class SupplyViewSet(viewsets.ModelViewSet):
    serializer_class = SupplySerializer
    queryset = Supply.objects.all().select_related('supplier')
    service_layer = SupplyService()

    def get_queryset(self):
        if self.action != 'list':
            return self.queryset
        
        supply_time = self.request.query_params.get('type', None)
        supplier_name = self.request.query_params.get('supplier', None)
        if supply_time:
            supplies_dto = self.service_layer.get_supplies(supply_time, supplier_name)
            return self.queryset.filter(id__in=[dto.id for dto in supplies_dto])
        else:
            try:
                date_param = self.request.query_params.get("date", timezone.now().date())
                payment_type = self.request.query_params.get('payment_type', 'all')
            except ValueError:
                return Response(
                    {"detail": "Invalid date format. Use YYYY-MM-DD."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            only_confirmed = self.request.query_params.get('confirmed', 'true').lower() == 'true'
            supplies_dto = self.service_layer.get_supplies_by_date(date_param, only_confirmed, payment_type)
            return self.queryset.filter(id__in=[dto.id for dto in supplies_dto])
    


class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerializer
    pagination_class = SupplierResultsPaginationPage
    service_layer = ClientService()
    queryset = Client.objects.all()
    def get_queryset(self):
        q = self.request.query_params.get('q', '')
        show_zeros = int(self.request.query_params.get('show_zeros', 1))
        # print('views.py: ',type(show_zeros))
        filter_tag = self.request.query_params.get('filter_tag', 'latest')
        if q or filter_tag:
            filter_dict = {
                'oldest': 'last_accessed',
                'latest': '-last_accessed',
                'max': '-debt',
                'min': 'debt'
            }

            order_field = filter_dict.get(filter_tag)
            clients_dto = self.service_layer.search(q, bool(show_zeros))
            return self.queryset.filter(id__in=[dto.id for dto in clients_dto]).order_by(order_field)
        # return super().get_queryset()

    @action(detail=True, methods=['post'])
    def add_debt(self, request, pk=None):
        client = self.get_object()
        debt_value = request.data.get('debt_value', None)
        ruid = request.data.get('responsible_employee_id', None)
        if not debt_value:
             raise ValidationError("Сумма не указана")
        try:
            client_object = self.service_layer.apply_debt_change(client, debt_value, ruid)
            return Response(vars(client_object))
        except ValidationError as e:
            logger.error(e)
            return Response({"error": str(e)}, status=400)
    
    @action(detail=False, methods = ['delete'], url_path='delete_debt(?:/(?P<debt_id>[^/.]+))?')
    def delete_debt(self, request, debt_id=None):
        try:
            if not debt_id:
                return Response(
                    {"error": "Debt ID is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            updated_client = self.service_layer.delete_debt_by_id(debt_id)
            return Response(
                ClientSerializer(updated_client).data,
                status=status.HTTP_200_OK
            )
            
        except ClientDebt.DoesNotExist:
            return Response(
                {"error": "Debt not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def get_debts(self, request, pk=None):
        client = self.get_object()
        results_dto = self.service_layer.get_debts(client)
        return Response([vars(dto) for dto in results_dto])
    
    @action(detail=True, methods=['get'])
    def get_stats(self, request, pk = None):
        client_obj = self.get_object()
        anal = ClientStats(client_obj)
        return JsonResponse(anal.execute())

class CashFlowViewSet(viewsets.ModelViewSet):
    serializer_class = CashFlowSerializer
    queryset = CashFlow.objects.all()
    service_layer = CashFlowService()

    @action(detail=False, methods=['get'])
    def by_date(self, request):
        date = request.query_params.get('date', timezone.now().date())
        flow_type = request.query_params.get('flow_type', 'all')
        cashflows_dto = self.service_layer.get_cashflows_by_date(date, flow_type)
        return Response(vars(cashflow) for cashflow in cashflows_dto)
    
    def perform_create(self, serializer): 
        cache.delete(f'cashflow_{timezone.now().date()}')
        action = 'Вынос' if serializer.validated_data['amount'] < 0 else "Внесение"
        logger.info(f"{action} в размере {serializer.validated_data['amount']}")

        return super().perform_create(serializer)

    def perform_destroy(self, instance):
        cache.delete(f'cashflow_{timezone.now().date()}')
        return super().perform_destroy(instance)
    
    def perform_update(self, serializer):
        cache.delete(f'cashflow_{timezone.now().date()}')
        return super().perform_update(serializer)

class EmployeeViewSet(viewsets.ModelViewSet):
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.all()

class SupplierCustomAPIView(generics.ListAPIView):
    serializer_class = SupplierCustomSerializer
    def get_queryset(self):
        return Supplier.objects.exclude(name="[удаленный поставщик]") \
            .only('name', 'is_everyday_supply') \
            .order_by('-is_everyday_supply')

class LoggingTemplateView(TemplateView):
    def dispatch(self, request, *args, **kwargs):
        view_name = request.resolver_match.view_name
        print(f"{view_name:-^60}")
        return super().dispatch(request, *args, **kwargs)


