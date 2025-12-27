from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *
router = routers.DefaultRouter()
router.register(r'suppliers', SupplierViewSet, basename='suppliers')
router.register(r'supplies', SupplyViewSet, basename='supplies')
router.register(r'clients', ClientViewSet, basename='clients')
router.register(r'cashflows', CashFlowViewSet, basename='cashflows')
router.register(r'employees', EmployeeViewSet, basename='employees')

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('server-time/', getServerTime),
    path('api/v1/auth/register/', RegisterView.as_view(), name='register'),
    path('api/v1/auth/login/', LoginView.as_view(), name='login'),
    path('api/v1/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/v1/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/auth/me/', CurrentUserView.as_view(), name='current_user'),
    path('api/v1/auth/profile/', UserProfileView.as_view(), name='user_profile'),
]