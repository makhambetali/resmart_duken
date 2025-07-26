from django.contrib import admin
from .models import Supplier, Supply, SupplyImage, Client, ClientDebt, CashFlow


@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('name', 'supervisor', 'is_everyday_supply', 'last_accessed', 'date_added')
    search_fields = ('name', 'supervisor', 'representative')
    list_filter = ('is_everyday_supply',)


@admin.register(Supply)
class SupplyAdmin(admin.ModelAdmin):
    list_display = ('supplier', 'price_cash', 'price_bank', 'bonus', 'exchange', 'delivery_date', 'is_confirmed', 'arrival_date')
    list_filter = ('is_confirmed', 'delivery_date')
    search_fields = ('supplier__name',)
    date_hierarchy = 'delivery_date'


@admin.register(SupplyImage)
class SupplyImageAdmin(admin.ModelAdmin):
    list_display = ('supply', 'image')


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', 'is_chosen', 'debt', 'last_accessed')
    search_fields = ('name',)
    list_filter = ('is_chosen',)


@admin.register(ClientDebt)
class ClientDebtAdmin(admin.ModelAdmin):
    list_display = ('client', 'debt_value', 'date_added')


@admin.register(CashFlow)
class CashFlowAdmin(admin.ModelAdmin):
    list_display = ('amount', 'description', 'date_added')
    date_hierarchy = 'date_added'
