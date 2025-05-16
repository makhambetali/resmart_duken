from django.db import models

class Supplier(models.Model):
    name = models.CharField(max_length=30, db_index=True, unique=True)
    description = models.TextField(blank=True, null=True)
    last_accessed = models.DateTimeField(auto_now=True)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Supply(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='supplier')
    price_cash = models.PositiveIntegerField(default=0)
    price_bank = models.PositiveIntegerField(default=0)
    bonus = models.SmallIntegerField(default=0)
    exchange = models.SmallIntegerField(default=0)
    delivery_date = models.DateField(db_index=True)
    comment = models.TextField(blank=True, null=True)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.supplier}: {self.price_bank + self.price_cash}"
    
class SupplyImage(models.Model):
    supply = models.ForeignKey(Supply, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='supply_images/')

    def __str__(self):
        return f"Image for {self.supply}"
    

class Client(models.Model):
    name = models.CharField(max_length=25, db_index=True, unique=True)
    description = models.TextField(blank=True)
    phone_number = models.CharField(max_length=25, blank=True)
    is_chosen = models.BooleanField(default=False)
    debt = models.IntegerField(default=0)

    last_accessed = models.DateTimeField(auto_now=True)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} : {self.debt}"
    
class ClientDebt(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='debts')
    debt_value = models.IntegerField()
    date_added = models.DateTimeField(auto_now_add=True)


class CashFlow(models.Model):
    amount = models.IntegerField()
    description = models.TextField(blank=True)
    date_added = models.DateTimeField(auto_now_add=True, db_index=True)

    def __str__(self):
        return f'{self.amount}'