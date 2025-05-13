from django.urls import path, include
from rest_framework import routers

from .views import SupplierViewSet, SupplyViewSet, HomePageView, SuppliersPageView
router = routers.DefaultRouter()
router.register(r'suppliers', SupplierViewSet, basename='suppliers')
router.register(r'supplies', SupplyViewSet, basename='supplies')

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('', HomePageView.as_view(), name='home-page'),
    path('suppliers-page/', SuppliersPageView.as_view(), name='suppliers-page'),
]
