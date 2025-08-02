from django.core.cache import cache
from django.db.models import QuerySet
from typing import List
from app.models import Supplier
class SupplierDAO:
    def search(self, query: str) -> QuerySet[Supplier]:
        """Поставки с delivery_date раньше текущей даты."""
        queryset = Supplier.objects.all().order_by('-last_accessed')
        if query:
            queryset = queryset.filter(name__icontains=query.lower())
        return queryset
        
    # def set_everydays(self, ids: List[int] = None):
    #     if ids is None:
    #         ids = []
        
    #     # Очищаем дубликаты и некорректные значения
    #     ids_set = set(filter(lambda x: x and x > 0, ids))
        
    #     # Получаем текущее состояние из БД (более надежно чем кеш)
    #     current_everyday_ids = set(
    #         Supplier.objects.filter(is_everyday_supply=True).values_list('id', flat=True)
    #     )
        
    #     # Определяем изменения
    #     to_enable = ids_set - current_everyday_ids  # Новые поставщики для включения
    #     to_disable = current_everyday_ids - ids_set  # Поставщики для отключения
        
    #     # Счетчики для статистики
    #     enabled_count = 0
    #     disabled_count = 0
        
    #     try:
    #         # Используем транзакцию для атомарности операции
    #         from django.db import transaction
            
    #         with transaction.atomic():
    #             # Включаем новых поставщиков
    #             if to_enable:
    #                 # Проверяем, что все ID существуют в БД
    #                 existing_to_enable = set(
    #                     Supplier.objects.filter(id__in=to_enable).values_list('id', flat=True)
    #                 )
    #                 non_existing = to_enable - existing_to_enable
                    
    #                 if non_existing:
    #                     print(f"Warning: Поставщики с ID {non_existing} не найдены в БД")
                    
    #                 if existing_to_enable:
    #                     enabled_count = Supplier.objects.filter(
    #                         id__in=existing_to_enable
    #                     ).update(is_everyday_supply=True)
                
    #             # Отключаем удаленных поставщиков
    #             if to_disable:
    #                 disabled_count = Supplier.objects.filter(
    #                     id__in=to_disable
    #                 ).update(is_everyday_supply=False)
                
    #             # Обновляем кеш только после успешного обновления БД
    #             cache.set('everyday_supplies', list(ids_set), timeout=60*60*24)  # Кеш на 24 часа
                
    #             # Логируем изменения
    #             if enabled_count > 0 or disabled_count > 0:
    #                 print(f"Everyday suppliers updated: enabled={enabled_count}, disabled={disabled_count}")
    #                 print(f"Enabled IDs: {to_enable}")
    #                 print(f"Disabled IDs: {to_disable}")
    #             else:
    #                 print("No changes in everyday suppliers")
                    
    #     except Exception as e:
    #         print(f"Error updating everyday suppliers: {e}")
    #         # Очищаем кеш при ошибке, чтобы данные загружались из БД
    #         cache.delete('everyday_supplies')
    #         raise
        
    
