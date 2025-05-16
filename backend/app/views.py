from django.shortcuts import render
from django.views.generic.base import TemplateView
from django.utils import timezone

from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response


from .serializers import *
from .pagination import SupplierResultsPaginationPage
from .models import *
from .services.supply import SupplyService
from .services.supplier import SupplierService
from .services.client import ClientService
from .services.cashflow import CashFlowService

class SupplierViewSet(viewsets.ModelViewSet):
    serializer_class = SupplierSerializer
    pagination_class = SupplierResultsPaginationPage
    service_layer = SupplierService()
    def get_queryset(self):
        q = self.request.query_params.get('q')
        return self.service_layer.search(q)
    
class SupplyViewSet(viewsets.ModelViewSet):
    serializer_class = SupplySerializer
    service_layer = SupplyService()
    def get_queryset(self):
        supply_type = self.request.query_params.get('type')
        return self.service_layer.get_supplies(supply_type)
    
    @action(detail=False, methods=['get'])
    def get_by_date(self, request):
        date = self.request.query_params.get("date", timezone.now().date())
        queryset = self.service_layer.get_supplies_by_date(date)
        return Response(SupplySerializer(queryset, many=True).data)

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
    def get_queryset(self):
        q = self.request.query_params.get('q', '')
        filter_tag = self.request.query_params.get('filter_tag', 'latest')  # значение по умолчанию
        return self.service_layer.search(q, filter_tag)

    @action(detail=True, methods=['post'])
    def add_debt(self, request, pk=None):
        client = self.get_object()
        debt_value = request.data.get('debt_value')
        results = self.service_layer.add_debt(client, debt_value)
        return Response(results)
    
    @action(detail=False, methods = ['delete'], url_path='delete_debt(?:/(?P<debt_id>[^/.]+))?')
    def delete_debt(self, request, debt_id=None):
        if debt_id:
            self.service_layer.delete_one_debt(debt_id)

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get'])
    def get_debts(self, request, pk=None):
        client = self.get_object()
        results = self.service_layer.get_debts(client)
        return Response(results)

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