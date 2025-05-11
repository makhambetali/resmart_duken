from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response


from .serializers import SupplierSerializer, SupplySerializer, SupplyImageSerializer
from .pagination import SupplierResultsPaginationPage
from .models import Supplier, Supply
from .services.supply import SupplyService

class SupplierViewSet(viewsets.ModelViewSet):
    serializer_class = SupplierSerializer
    pagination_class = SupplierResultsPaginationPage
    def get_queryset(self):
        queryset = Supplier.objects.all()
        q = self.request.query_params.get('q')
        if q:
            return queryset.filter(name__icontains = q)
        
        return queryset

class SupplyViewSet(viewsets.ModelViewSet):
    serializer_class = SupplySerializer
    def get_queryset(self):
        supply_type = self.request.query_params.get('type')
        return SupplyService().get_supplies(supply_type)

    @action(detail=True, methods=['get'])
    def images(self, request, pk=None):
        supply = self.get_object()
        images = supply.images.all()
        serializer = SupplyImageSerializer(images, many=True, context={'request': request})
        return Response(serializer.data)