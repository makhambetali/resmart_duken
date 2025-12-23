from django.db import models
from django.utils import timezone



class Supplier(models.Model):
    name = models.CharField(max_length=30, db_index=True, unique=True)
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
    valid = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Поставщик"
        verbose_name_plural = "Поставщики"


def get_default_supplier():
    return Supplier.objects.get_or_create(name="[удаленный поставщик]")[0].id

class Supply(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_DEFAULT, default=get_default_supplier, related_name='supplier')
    price_cash = models.PositiveIntegerField(default=0)
    price_bank = models.PositiveIntegerField(default=0)
    bonus = models.SmallIntegerField(default=0)
    exchange = models.SmallIntegerField(default=0)
    delivery_date = models.DateField(db_index=True)
    comment = models.TextField(blank=True, null=True)
    is_confirmed = models.BooleanField(default=False)
    arrival_date = models.DateTimeField(null=True, blank=True)
    date_added = models.DateTimeField(auto_now_add=True)
    invoice_html = models.TextField(blank=True)
    rescheduled_cnt = models.PositiveSmallIntegerField(default=0)
    def __str__(self):
        return f"{self.supplier}: {self.price_bank + self.price_cash}"
    
    def save(self, *args, **kwargs):
        if self.is_confirmed and not self.arrival_date:
            self.arrival_date = timezone.localtime()

        elif not self.is_confirmed:
            self.arrival_date = None
        
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Поставка"
        verbose_name_plural = "Поставки"
    
class SupplyImage(models.Model):
    supply = models.ForeignKey(Supply, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='supply_images/')

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
    responsible_employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    is_valid = models.BooleanField(default=True)
    repaid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Долг"
        verbose_name_plural = "Долги"


class CashFlow(models.Model):
    amount = models.IntegerField()
    description = models.TextField(blank=True)
    date_added = models.DateTimeField(auto_now_add=True, db_index=True)

    def __str__(self):
        return f'{self.amount}'
    
    class Meta:
        verbose_name = "Внос/вынос денег"
        verbose_name_plural = "Внос/вынос денег"

