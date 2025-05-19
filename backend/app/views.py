from django.shortcuts import render, get_object_or_404
from django.views.generic.base import TemplateView
from django.utils import timezone
from datetime import date
from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from .serializers import *
from .pagination import SupplierResultsPaginationPage
from .models import *
from .services.supply_service import SupplyService
from .services.supplier import SupplierService
from .services.client import ClientService
from .services.cashflow import CashFlowService

class SupplierViewSet(viewsets.ModelViewSet):
    serializer_class = SupplierSerializer
    pagination_class = SupplierResultsPaginationPage
    service_layer = SupplierService()
    queryset = Supplier.objects.all().order_by('-last_accessed')
    def get_queryset(self):
        q = self.request.query_params.get('q', None)
        if q:
            suppliers_dto = self.service_layer.search(q)
            return Supplier.objects.filter(id__in=[dto.id for dto in suppliers_dto])
        
        return super().get_queryset()
    
# class SupplyViewSet(viewsets.ModelViewSet):
#     serializer_class = SupplySerializer
#     service_layer = SupplyService()
#     def get_queryset(self):
#         supply_type = self.request.query_params.get('type')
#         return self.service_layer.get_supplies(supply_type)
    
#     @action(detail=False, methods=['get'])
#     def get_by_date(self, request):
#         date = self.request.query_params.get("date", timezone.now().date())
#         queryset = self.service_layer.get_supplies_by_date(date)
#         return Response(SupplySerializer(queryset, many=True).data)

#     @action(detail=True, methods=['get', 'delete'], url_path='images(?:/(?P<image_id>[^/.]+))?')
#     def images(self, request, pk=None, image_id=None):
#         supply = self.get_object()

#         if image_id:
#             # Обработка одного изображения
#             try:
#                 image = supply.images.get(pk=image_id)
#             except SupplyImage.DoesNotExist:
#                 return Response({'detail': 'Image not found.'}, status=status.HTTP_404_NOT_FOUND)

#             if request.method == 'GET':
#                 serializer = SupplyImageSerializer(image, context={'request': request})
#                 return Response(serializer.data)

#             if request.method == 'DELETE':
#                 image.delete()
#                 return Response(status=status.HTTP_204_NO_CONTENT)

#         else:
#             # Обработка всех изображений
#             if request.method == 'GET':
#                 images = supply.images.all()
#                 serializer = SupplyImageSerializer(images, many=True, context={'request': request})
#                 return Response(serializer.data)
#             else:
#                 return Response({'detail': 'Method not allowed without image_id.'},
#                                 status=status.HTTP_405_METHOD_NOT_ALLOWED)

class SupplyViewSet(viewsets.ModelViewSet):
    serializer_class = SupplySerializer
    queryset = Supply.objects.all().select_related('supplier')
    service_layer = SupplyService()

    def get_queryset(self):
        supply_type = self.request.query_params.get('type', 'future')
        if supply_type in ('past', 'future'):
            supplies_dto = self.service_layer.get_supplies(supply_type)
            return Supply.objects.filter(id__in=[dto.id for dto in supplies_dto])
        return super().get_queryset()

    @action(detail=False, methods=['get'])
    def by_date(self, request):
        """Получение поставок по дате с пагинацией"""
        try:
            date_param = request.query_params.get("date")
            target_date = date.fromisoformat(date_param) if date_param else timezone.now().date()
        except ValueError:
            return Response(
                {"detail": "Invalid date format. Use YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST
            )

        only_confirmed = request.query_params.get('confirmed', 'true').lower() == 'true'
        supplies_dto = self.service_layer.get_supplies_by_date(target_date, only_confirmed)
        print(supplies_dto)
        return Response([vars(dto) for dto in supplies_dto])
    @action(detail=True, methods=['get', 'delete'], url_path='images(?:/(?P<image_id>[^/.]+))?')
    def images(self, request, pk=None, image_id=None):
        supply = self.get_object()

        if image_id:
            # Обработка одного изображения
            try:
                image = supply.images.get(pk=image_id)
            except SupplyImage.DoesNotExist:
                return Response({'detail': 'Image not found.'}, status=status.HTTP_404_NOT_FOUND)

            if request.method == 'GET':
                serializer = SupplyImageSerializer(image, context={'request': request})
                return Response(serializer.data)

            if request.method == 'DELETE':
                image.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)

        else:
            # Обработка всех изображений
            if request.method == 'GET':
                images = supply.images.all()
                serializer = SupplyImageSerializer(images, many=True, context={'request': request})
                return Response(serializer.data)
            else:
                return Response({'detail': 'Method not allowed without image_id.'},
                                status=status.HTTP_405_METHOD_NOT_ALLOWED)
class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerializer
    pagination_class = SupplierResultsPaginationPage
    service_layer = ClientService()
    queryset = Client.objects.all().order_by('-last_accessed')
    def get_queryset(self):
        q = self.request.query_params.get('q', '')
        filter_tag = self.request.query_params.get('filter_tag', 'latest')
        if q or filter_tag:
            filter_dict = {
                'oldest': 'last_accessed',
                'latest': '-last_accessed',
                'max': '-debt',
                'min': 'debt'
            }

            order_field = filter_dict.get(filter_tag, '-last_accessed')
            clients_dto = self.service_layer.search(q)
            return Client.objects.filter(id__in=[dto.id for dto in clients_dto]).order_by(order_field)
        return super().get_queryset()

    @action(detail=True, methods=['post'])
    def add_debt(self, request, pk=None):
        client = self.get_object()
        debt_value = request.data.get('debt_value')
        try:
            client_object = self.service_layer.add_debt(client, debt_value)
            return Response(vars(client_object))
        except ValidationError as e:
            return Response({"error": str(e)}, status=400)
    
    @action(detail=False, methods = ['delete'], url_path='delete_debt(?:/(?P<debt_id>[^/.]+))?')
    def delete_debt(self, request, debt_id=None):
        try:
            if not debt_id:
                return Response(
                    {"error": "Debt ID is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            updated_client = self.service_layer.delete_one_debt(debt_id)
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
        # print(results_dto)
        return Response([vars(dto) for dto in results_dto])

class CashFlowViewSet(viewsets.ModelViewSet):
    serializer_class = CashFlowSerializer
    queryset = CashFlow.objects.all()
    service_layer = CashFlowService()

    def list(self, request, *args, **kwargs):
        date = request.query_params.get('date', timezone.now().date())
        return Response(self.service_layer.get_instance(date))
    
    @action(detail=False, methods=['get'])
    def sum(self, request):
        return Response({"total_sum": self.service_layer.find_sum()})

class SupplierCustomAPIView(generics.ListAPIView):
    serializer_class = SupplierCustomSerializer
    queryset = Supplier.objects.all()

class HomePageView(TemplateView):
    template_name = 'home-page.html'

class SuppliersPageView(TemplateView):
    template_name = 'suppliers-page.html'


class ClientsPageView(TemplateView):
    template_name = 'clients-page.html'

class FinancePageView(TemplateView):
    template_name = 'finance-page.html'