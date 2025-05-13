from django.shortcuts import render
from django.views.generic.base import TemplateView

from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response


from .serializers import SupplierSerializer, SupplySerializer, SupplyImageSerializer
from .pagination import SupplierResultsPaginationPage
from .models import Supplier, Supply, SupplyImage
from .services.supply import SupplyService

class SupplierViewSet(viewsets.ModelViewSet):
    serializer_class = SupplierSerializer
    
    def get_queryset(self):
        queryset = Supplier.objects.all().order_by('-last_accessed')
        q = self.request.query_params.get('q')
        if q:
            return queryset.filter(name__icontains=q)
        
        return queryset
        
    # def create(self, request, *args, **kwargs):
    #     """Переопределяем метод создания для немедленного возврата"""
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)
    #     headers = self.get_success_headers(serializer.data)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        
    # def update(self, request, *args, **kwargs):
    #     """Переопределяем метод обновления для немедленного возврата"""
    #     partial = kwargs.pop('partial', False)
    #     instance = self.get_object()
    #     serializer = self.get_serializer(instance, data=request.data, partial=partial)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_update(serializer)
    #     return Response(serializer.data)

    
    
    # @action(detail=False, methods=['get'])
    # def last_accessed(self, request, pk=None):
    #     queryset = Supplier.objects.all().order_by('last_accessed')[:5]
    #     results = SupplierSerializer(queryset, many=True)
    #     return Response({'results':results.data})


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


class HomePageView(TemplateView):
    template_name = 'home-page.html'

class SuppliersPageView(TemplateView):
    template_name = 'suppliers-page.html'