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
    # pagination_class = SupplierResultsPaginationPage
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


class ImageDeleteView(generics.DestroyAPIView):
    queryset = SupplyImage.objects.all()
    serializer_class = SupplyImageSerializer
class HomePageView(TemplateView):
    template_name = 'home-page.html'