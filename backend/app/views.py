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
    def get_queryset(self):
        q = self.request.query_params.get('q')
        return SupplierService().search(q)
    
class SupplyViewSet(viewsets.ModelViewSet):
    serializer_class = SupplySerializer
    def get_queryset(self):
        supply_type = self.request.query_params.get('type')
        return SupplyService().get_supplies(supply_type)

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
                return Response({'detail': 'Deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

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

    def get_queryset(self):
        q = self.request.query_params.get('q', '')
        filter_tag = self.request.query_params.get('filter_tag', 'latest')  # значение по умолчанию
        return ClientService().search(q, filter_tag)

    @action(detail=True, methods=['post'])
    def add_debt(self, request, pk=None):
        client = self.get_object()
        debt_value = request.data.get('debt_value')
        results = ClientService().add_debt(client, debt_value)
        return Response(results)
    
    @action(detail=False, methods = ['delete'], url_path='delete_debt(?:/(?P<debt_id>[^/.]+))?')
    def delete_debt(self, request, debt_id=None):
        if debt_id:
            ClientService().delete_one_debt(debt_id)

        return Response({'r':'r'})

    @action(detail=True, methods=['get'])
    def get_debts(self, request, pk=None):
        client = self.get_object()
        results = ClientService().get_debts(client)
        return Response(results)

class CashFlowViewSet(viewsets.ModelViewSet):
    serializer_class = CashFlowSerializer
    queryset = CashFlow.objects.all()

    def list(self, request, *args, **kwargs):
        date = request.query_params.get('date', timezone.now().date())
        return Response(CashFlowService().get_instance(date))

class SupplierCustomAPIView(generics.ListAPIView):
    serializer_class = SupplierCustomSerializer
    queryset = Supplier.objects.all()

class HomePageView(TemplateView):
    template_name = 'home-page.html'

class SuppliersPageView(TemplateView):
    template_name = 'suppliers-page.html'


class ClientsPageView(TemplateView):
    template_name = 'clients-page.html'