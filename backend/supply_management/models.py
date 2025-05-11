from django.db import models

class Supplier(models.Model):
    name = models.CharField(max_length=30, db_index=True, unique=True)
    description = models.TextField(blank=True, null=True)

    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Supply(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='supplier')
    price = models.PositiveIntegerField(default=0)
    bonus = models.SmallIntegerField(default=0)
    exchange = models.SmallIntegerField(default=0)
    delivery_date = models.DateField(db_index=True)

    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.supplier}: {self.price}"
    
class SupplyImage(models.Model):
    supply = models.ForeignKey(Supply, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='supply_images/')

    def __str__(self):
        return f"Image for {self.supply}"