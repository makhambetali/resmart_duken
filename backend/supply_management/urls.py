from django.urls import path, include
from rest_framework import routers

from .views import SupplierViewSet, SupplyViewSet, HomePageView

router = routers.DefaultRouter()
router.register(r'suppliers', SupplierViewSet, basename='suppliers')
router.register(r'supplies', SupplyViewSet, basename='supplies')

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('', HomePageView.as_view())
]
