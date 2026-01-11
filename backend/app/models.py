from django.db import models
from django.utils import timezone
from django.conf import settings
import os
import uuid

SUPPLY_STATUS_CHOICES = [
    ('pending', 'Не подтверждена'),
    ('confirmed', "Ожидает оплаты"),
    ('delivered', 'Подтверждена'),
]


class Store(models.Model):
    name = models.CharField(max_length=50, default='Магазин')
    # owner = models.OneToOneField(settings.AUTH_USER_MODEL,
    #                              on_delete=models.CASCADE,
    #                             related_name="owner_store")
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.name}"

class UserProfile(models.Model):
    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        EMPLOYEE = "employee", "Employee"
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='users')
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.EMPLOYEE
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def is_admin(self):
        return self.role == self.Role.ADMIN

    def is_employee(self):
        return self.role == self.Role.EMPLOYEE

    def __str__(self):
        return f"{self.user.username} ({self.role})"
    


class Supplier(models.Model):
    name = models.CharField(max_length=30, db_index=True)
    description = models.TextField(blank=True, null=True)
    supervisor = models.CharField(blank=True, max_length=30)
    supervisor_pn = models.CharField(blank=True, max_length=30)
    representative = models.CharField(blank=True, max_length=30)
    representative_pn = models.CharField(blank=True, max_length=30)
    delivery = models.CharField(blank=True, max_length=30)
    delivery_pn = models.CharField(blank=True, max_length=30)
    is_everyday_supply = models.BooleanField(default=False)
    last_accessed = models.DateTimeField(blank=True, null=True)
    date_added = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    valid = models.BooleanField(default=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='suppliers', blank=True)
    def __str__(self):
        return f"{self.name}_{self.store}"
    
        
    class Meta:
        verbose_name = "Поставщик"
        verbose_name_plural = "Поставщики"
        constraints = [
            models.UniqueConstraint(
                fields=['name','store'],
                name='unique_supplier_per_store'
            )
        ]


def get_default_supplier():
    return Supplier.objects.get_or_create(name="[удаленный поставщик]")[0].id

class Supply(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='supplier')
    price_cash = models.PositiveIntegerField(default=0)
    price_bank = models.PositiveIntegerField(default=0)
    bonus = models.SmallIntegerField(default=0)
    exchange = models.SmallIntegerField(default=0)
    delivery_date = models.DateField(db_index=True)
    comment = models.TextField(blank=True, null=True)
    # is_confirmed = models.BooleanField(default=False)
    status = models.CharField(choices=SUPPLY_STATUS_CHOICES, max_length=30, default='pending')
    arrival_date = models.DateTimeField(null=True, blank=True)
    date_added = models.DateTimeField(auto_now_add=True)
    invoice_html = models.TextField(blank=True)
    rescheduled_cnt = models.PositiveSmallIntegerField(default=0)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='supplies', blank=True)
    
    def __str__(self):
        return f"{self.supplier}|{self.comment}: {self.price_bank + self.price_cash}"
    
    # def save(self, *args, **kwargs):
    #     local_time = timezone.localtime()
    #     if self.status != 'pending' and not self.arrival_date:
    #         self.arrival_date = local_time

    #     elif self.status != 'pending':
    #         self.arrival_date = None

    #     self.supplier.last_accessed = local_time
    #     self.supplier.save()
        
    #     super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Поставка"
        verbose_name_plural = "Поставки"

def upload_to(instance, filename):
    ext = os.path.splitext(filename)[1]
    return f"supply/{instance.supply.id}/{uuid.uuid4()}{ext}"


class SupplyImage(models.Model):
    supply = models.ForeignKey(Supply, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=upload_to)

    def __str__(self):
        return f"Image for {self.supply}"
    

class Client(models.Model):
    name = models.CharField(verbose_name='именем', max_length=25, db_index=True, unique=True)
    description = models.TextField(blank=True)
    phone_number = models.CharField(max_length=25, blank=True)
    is_chosen = models.BooleanField(default=False)
    debt = models.IntegerField(default=0)

    last_accessed = models.DateTimeField(auto_now=True)
    date_added = models.DateTimeField(auto_now_add=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='clients', blank=True)
    def __str__(self):
        return f"{self.name} : {self.debt}"
    
    class Meta:
        verbose_name = "Клиент"
        verbose_name_plural = "Клиенты"

class Employee(models.Model):
    name = models.CharField(max_length=30, verbose_name='Имя продавца')

    def __str__(self):
        return self.name
        
class ClientDebt(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='debts')
    debt_value = models.IntegerField()
    date_added = models.DateTimeField(auto_now_add=True)
    responsible_employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_valid = models.BooleanField(default=True)
    repaid_at = models.DateTimeField(null=True, blank=True)
    description = models.TextField(blank=True)
    class Meta:
        verbose_name = "Долг"
        verbose_name_plural = "Долги"


class CashFlow(models.Model):
    amount = models.IntegerField()
    description = models.TextField(blank=True)
    date_added = models.DateTimeField(auto_now_add=True, db_index=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='cashflows', blank=True)
    def __str__(self):
        return f'{self.amount}'
    
    class Meta:
        verbose_name = "Внос/вынос денег"
        verbose_name_plural = "Внос/вынос денег"


class Lead(models.Model):
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=30)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Заявка'
        verbose_name_plural = 'Заявки'
