from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from app.models import SupplyImage, UserProfile
from django.contrib.auth.models import User

@receiver(post_delete, sender=SupplyImage)
def delete_image_from_s3(sender, instance, **kwargs):
    if instance.image:
        instance.image.delete(save=False)


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    """
    Создает или обновляет профиль пользователя при сохранении User.
    """
    if created:
        # Если пользователь только что создан, создаем профиль
        UserProfile.objects.get_or_create(
            user=instance,
            defaults={'role': UserProfile.Role.EMPLOYEE}
        )
    else:
        # Если пользователь обновлен, обновляем профиль
        UserProfile.objects.get_or_create(user=instance)