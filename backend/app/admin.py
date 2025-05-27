from django.contrib import admin
from app.models import *
# Register your models here.

admin.site.register(Supply)
admin.site.register(Supplier)
admin.site.register(Client)
admin.site.register(ClientDebt)
admin.site.register(CashFlow)