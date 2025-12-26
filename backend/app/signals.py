from django.db.models.signals import post_delete
from django.dispatch import receiver
from app.models import SupplyImage
@receiver(post_delete, sender=SupplyImage)
def delete_image_from_s3(sender, instance, **kwargs):
    if instance.image:
        instance.image.delete(save=False)
