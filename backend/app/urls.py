from django.urls import path, include
from rest_framework import routers

from .views import *
router = routers.DefaultRouter()
router.register(r'suppliers', SupplierViewSet, basename='suppliers')
router.register(r'supplies', SupplyViewSet, basename='supplies')
router.register(r'clients', ClientViewSet, basename='clients')
router.register(r'cashflows', CashFlowViewSet, basename='cashflows')
router.register(r'employees', EmployeeViewSet, basename='employees')

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('server-time/', getServerTime)
    # path('api/v1/all_suppliers/', SupplierCustomAPIView.as_view()),
]