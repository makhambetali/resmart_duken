from django.urls import path, include
from rest_framework import routers

from .views import *
router = routers.DefaultRouter()
router.register(r'suppliers', SupplierViewSet, basename='suppliers')
router.register(r'supplies', SupplyViewSet, basename='supplies')
router.register(r'clients', ClientViewSet, basename='clients')
router.register(r'cashflows', CashFlowViewSet, basename='cashflows')

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('api/v1/all_suppliers/', SupplierCustomAPIView.as_view()),

    path('', HomePageView.as_view(), name='home-page'),
    path('suppliers-page/', SuppliersPageView.as_view(), name='suppliers-page'),
    path('clients-page/', ClientsPageView.as_view(), name='clients-page'),
    path('finance-page/',FinancePageView.as_view(),name='finance-page' ),
]
 