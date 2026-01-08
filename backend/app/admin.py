from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import Supplier, Supply, SupplyImage, Client, ClientDebt, CashFlow, Employee, UserProfile, Store, Lead

admin.site.register(Supply)
admin.site.register(Supplier)
admin.site.register(SupplyImage)
admin.site.register(Client)
admin.site.register(ClientDebt)
admin.site.register(CashFlow)
admin.site.register(Employee)
admin.site.register(UserProfile)
admin.site.register(Store)
admin.site.register(Lead)

# class SupplyImageInline(admin.TabularInline):
#     model = SupplyImage
#     extra = 1
#     fields = ('image', 'image_preview')
#     readonly_fields = ('image_preview',)

#     def image_preview(self, obj):
#         if obj.image:
#             return format_html('<img src="{}" style="max-height: 100px; max-width: 100px;" />', obj.image.url)
#         return "Нет изображения"
#     image_preview.short_description = "Превью"


# class ClientDebtInline(admin.TabularInline):
#     model = ClientDebt
#     extra = 0
#     readonly_fields = ('date_added', 'is_valid', 'repaid_at')
#     fields = ('debt_value', 'responsible_employee', 'description', 'date_added', 'is_valid', 'repaid_at')


# @admin.register(Store)
# class StoreAdmin(admin.ModelAdmin):
#     list_display = ('name', 'created_at', 'user_count', 'supplier_count', 'client_count')
#     search_fields = ('name',)
#     ordering = ('-created_at',)
    
#     def user_count(self, obj):
#         return obj.users.count()
#     user_count.short_description = "Пользователи"
    
#     def supplier_count(self, obj):
#         return obj.suppliers.count()
#     supplier_count.short_description = "Поставщики"
    
#     def client_count(self, obj):
#         return obj.clients.count()
#     client_count.short_description = "Клиенты"


# @admin.register(UserProfile)
# class UserProfileAdmin(admin.ModelAdmin):
#     list_display = ('user', 'store', 'role', 'created_at', 'is_admin', 'is_employee')
#     list_filter = ('role', 'store', 'created_at')
#     search_fields = ('user__username', 'user__email')
#     list_editable = ('role', 'store')
#     fieldsets = (
#         ('Основная информация', {
#             'fields': ('user', 'store', 'role')
#         }),
#         ('Даты', {
#             'fields': ('created_at',),
#             'classes': ('collapse',)
#         }),
#     )
#     readonly_fields = ('created_at',)
    
#     def is_admin(self, obj):
#         return obj.is_admin()
#     is_admin.boolean = True
#     is_admin.short_description = "Админ"
    
#     def is_employee(self, obj):
#         return obj.is_employee()
#     is_employee.boolean = True
#     is_employee.short_description = "Сотрудник"


# @admin.register(Supplier)
# class SupplierAdmin(admin.ModelAdmin):
#     list_display = ('name', 'supervisor', 'is_everyday_supply', 'store', 'last_accessed', 'date_added', 'status_badge')
#     list_display_links = ('name',)
#     search_fields = ('name', 'supervisor', 'representative', 'description')
#     list_filter = ('is_everyday_supply', 'store', 'valid', 'date_added')
#     ordering = ('-date_added',)
#     readonly_fields = ('last_accessed', 'date_added', 'last_updated')
#     fieldsets = (
#         ('Основная информация', {
#             'fields': ('name', 'store', 'description', 'is_everyday_supply', 'valid')
#         }),
#         ('Контакты', {
#             'fields': (
#                 ('supervisor', 'supervisor_pn'),
#                 ('representative', 'representative_pn'),
#                 ('delivery', 'delivery_pn')
#             ),
#             'classes': ('collapse',)
#         }),
#         ('Даты', {
#             'fields': ('last_accessed', 'date_added', 'last_updated'),
#             'classes': ('collapse',)
#         }),
#     )
    
#     def status_badge(self, obj):
#         if obj.valid:
#             return format_html('<span style="color: green; font-weight: bold;">✓ Активен</span>')
#         return format_html('<span style="color: red; font-weight: bold;">✗ Неактивен</span>')
#     status_badge.short_description = "Статус"


# @admin.register(Supply)
# class SupplyAdmin(admin.ModelAdmin):
#     list_display = ('supplier_link', 'store', 'total_price', 'delivery_date', 'status_badge', 'arrival_date', 'is_confirmed_badge')
#     list_filter = ('status', 'delivery_date', 'store', 'supplier')  # Изменено с is_confirmed на status
#     search_fields = ('supplier__name', 'comment')
#     date_hierarchy = 'delivery_date'
#     ordering = ('-delivery_date',)
#     inlines = [SupplyImageInline]
#     readonly_fields = ('date_added', 'arrival_date', 'rescheduled_cnt', 'status_display')
#     list_per_page = 50
#     fieldsets = (
#         ('Основная информация', {
#             'fields': ('supplier', 'store', 'delivery_date', 'status')
#         }),
#         ('Финансы', {
#             'fields': (
#                 ('price_cash', 'price_bank'),
#                 ('bonus', 'exchange'),
#                 'total_amount'
#             )
#         }),
#         ('Дополнительно', {
#             'fields': ('comment', 'invoice_html'),
#             'classes': ('collapse',)
#         }),
#         ('Даты и счетчики', {
#             'fields': ('arrival_date', 'date_added', 'rescheduled_cnt', 'status_display'),
#             'classes': ('collapse',)
#         }),
#     )
    
#     def supplier_link(self, obj):
#         return format_html('<a href="{}">{}</a>', 
#                          f'../supplier/{obj.supplier.id}/change/',
#                          obj.supplier.name)
#     supplier_link.short_description = "Поставщик"
    
#     def total_price(self, obj):
#         total = obj.price_cash + obj.price_bank
#         return f"{total:,} ₸".replace(',', ' ')
#     total_price.short_description = "Сумма"
    
#     def total_amount(self, obj):
#         total = obj.price_cash + obj.price_bank
#         bonus = obj.bonus
#         exchange = obj.exchange
#         final = total + bonus + exchange
        
#         # Форматирование чисел с разделителями тысяч
#         total_formatted = f"{total:,}".replace(',', ' ')
#         cash_formatted = f"{obj.price_cash:,}".replace(',', ' ')
#         bank_formatted = f"{obj.price_bank:,}".replace(',', ' ')
#         bonus_formatted = f"{bonus:,}".replace(',', ' ')
#         exchange_formatted = f"{exchange:,}".replace(',', ' ')
#         final_formatted = f"{final:,}".replace(',', ' ')
        
#         return format_html(
#             '<strong>Итого: {} ₸</strong><br>'
#             'Наличные: {} ₸<br>'
#             'Банк: {} ₸<br>'
#             'Бонус: {} ₸<br>'
#             'Обмен: {} ₸'.format(
#                 final_formatted, cash_formatted, bank_formatted, bonus_formatted, exchange_formatted
#             )
#         )
#     total_amount.short_description = "Расчет суммы"
    
#     def status_badge(self, obj):
#         if obj.status == 'confirmed':
#             if obj.arrival_date:
#                 arrival = timezone.localtime(obj.arrival_date).strftime('%d.%m.%Y %H:%M')
#                 return format_html(
#                     '<span style="color: green; font-weight: bold;">✓ Подтверждена</span><br>'
#                     '<small>{}</small>', arrival
#                 )
#             return format_html('<span style="color: green; font-weight: bold;">✓ Подтверждена</span>')
#         elif obj.status == 'pending':
#             return format_html('<span style="color: blue; font-weight: bold;">⏳ Ожидает</span>')
#         elif obj.status == 'delivered':
#             return format_html('<span style="color: purple; font-weight: bold;">🚚 Доставлена</span>')
#         elif obj.status == 'cancelled':
#             return format_html('<span style="color: red; font-weight: bold;">✗ Отменена</span>')
#         return format_html('<span style="color: gray;">{}</span>', obj.get_status_display())
#     status_badge.short_description = "Статус"
    
#     def is_confirmed_badge(self, obj):
#         """Поле для отображения подтверждения (обратная совместимость)"""
#         return obj.status == 'confirmed'
#     is_confirmed_badge.boolean = True
#     is_confirmed_badge.short_description = "Подтверждена"
    
#     def status_display(self, obj):
#         """Отображение читаемого статуса"""
#         return obj.get_status_display()
#     status_display.short_description = "Статус (читаемый)"


# @admin.register(SupplyImage)
# class SupplyImageAdmin(admin.ModelAdmin):
#     list_display = ('supply_link', 'image_preview', 'supply_date')
#     list_filter = ('supply__delivery_date', 'supply__supplier')
#     search_fields = ('supply__supplier__name',)
#     readonly_fields = ('image_preview',)
    
#     def supply_link(self, obj):
#         return format_html('<a href="{}">{}</a>', 
#                          f'../supply/{obj.supply.id}/change/',
#                          obj.supply.supplier.name)
#     supply_link.short_description = "Поставка"
    
#     def supply_date(self, obj):
#         return obj.supply.delivery_date
#     supply_date.short_description = "Дата поставки"
    
#     def image_preview(self, obj):
#         if obj.image:
#             return format_html(
#                 '<a href="{}" target="_blank">'
#                 '<img src="{}" style="max-height: 200px; max-width: 200px;" />'
#                 '</a>', 
#                 obj.image.url, 
#                 obj.image.url
#             )
#         return "Нет изображения"
#     image_preview.short_description = "Изображение"


# @admin.register(Client)
# class ClientAdmin(admin.ModelAdmin):
#     list_display = ('name', 'phone_number', 'store', 'debt_display', 'is_chosen_badge', 'last_accessed', 'date_added')
#     list_filter = ('is_chosen', 'store', 'date_added')
#     search_fields = ('name', 'phone_number', 'description')
#     ordering = ('-date_added',)
#     inlines = [ClientDebtInline]
#     readonly_fields = ('last_accessed', 'date_added', 'debt_summary')
#     list_per_page = 50
#     fieldsets = (
#         ('Основная информация', {
#             'fields': ('name', 'store', 'phone_number', 'description', 'is_chosen')
#         }),
#         ('Долги', {
#             'fields': ('debt', 'debt_summary'),
#         }),
#         ('Даты', {
#             'fields': ('last_accessed', 'date_added'),
#             'classes': ('collapse',)
#         }),
#     )
    
#     def debt_display(self, obj):
#         debt_formatted = f"{abs(obj.debt):,}".replace(',', ' ')
#         if obj.debt > 0:
#             return format_html('<span style="color: red; font-weight: bold;">{} ₸</span>', debt_formatted)
#         elif obj.debt < 0:
#             return format_html('<span style="color: green;">{} ₸</span>', debt_formatted)
#         return format_html('<span style="color: gray;">{} ₸</span>', debt_formatted)
#     debt_display.short_description = "Долг"
    
#     def is_chosen_badge(self, obj):
#         if obj.is_chosen:
#             return format_html('<span style="color: green; font-weight: bold;">★ Избранный</span>')
#         return format_html('<span style="color: gray;">☆ Обычный</span>')
#     is_chosen_badge.short_description = "Статус"
    
#     def debt_summary(self, obj):
#         debts = obj.debts.filter(is_valid=True)
#         total = sum(debt.debt_value for debt in debts)
#         repaid = sum(1 for debt in debts if debt.repaid_at)
#         total_formatted = f"{total:,}".replace(',', ' ')
#         return format_html(
#             'Общая сумма долгов: <strong>{} ₸</strong><br>'
#             'Активных долгов: {}<br>'
#             'Погашено: {}'.format(total_formatted, debts.count(), repaid)
#         )
#     debt_summary.short_description = "Детализация долгов"


# @admin.register(ClientDebt)
# class ClientDebtAdmin(admin.ModelAdmin):
#     list_display = ('client_link', 'debt_value_display', 'responsible_employee', 'date_added', 'status_badge', 'repaid_at')
#     list_filter = ('is_valid', 'date_added', 'responsible_employee')
#     search_fields = ('client__name', 'description')
#     date_hierarchy = 'date_added'
#     readonly_fields = ('date_added', 'repaid_at')
#     fieldsets = (
#         ('Основная информация', {
#             'fields': ('client', 'responsible_employee', 'debt_value', 'description')
#         }),
#         ('Статус', {
#             'fields': ('is_valid', 'repaid_at')
#         }),
#         ('Даты', {
#             'fields': ('date_added',),
#             'classes': ('collapse',)
#         }),
#     )
    
#     def client_link(self, obj):
#         return format_html('<a href="{}">{}</a>', 
#                          f'../client/{obj.client.id}/change/',
#                          obj.client.name)
#     client_link.short_description = "Клиент"
    
#     def debt_value_display(self, obj):
#         debt_formatted = f"{abs(obj.debt_value):,}".replace(',', ' ')
#         if obj.debt_value > 0:
#             return format_html('<span style="color: red; font-weight: bold;">+{} ₸</span>', debt_formatted)
#         return format_html('<span style="color: green;">{} ₸</span>', debt_formatted)
#     debt_value_display.short_description = "Сумма"
    
#     def status_badge(self, obj):
#         if not obj.is_valid:
#             return format_html('<span style="color: red; font-weight: bold;">✗ Недействителен</span>')
#         elif obj.repaid_at:
#             return format_html('<span style="color: green; font-weight: bold;">✓ Погашен</span>')
#         return format_html('<span style="color: orange; font-weight: bold;">⏳ Активен</span>')
#     status_badge.short_description = "Статус"


# @admin.register(CashFlow)
# class CashFlowAdmin(admin.ModelAdmin):
#     list_display = ('amount_display', 'store', 'description_short', 'date_added_formatted')
#     list_filter = ('store', 'date_added')
#     search_fields = ('description',)
#     date_hierarchy = 'date_added'
#     ordering = ('-date_added',)
#     readonly_fields = ('date_added',)
#     list_per_page = 50
    
#     def amount_display(self, obj):
#         amount_formatted = f"{abs(obj.amount):,}".replace(',', ' ')
#         if obj.amount > 0:
#             return format_html('<span style="color: green; font-weight: bold;">+{} ₸</span>', amount_formatted)
#         return format_html('<span style="color: red; font-weight: bold;">{} ₸</span>', amount_formatted)
#     amount_display.short_description = "Сумма"
    
#     def description_short(self, obj):
#         if len(obj.description) > 50:
#             return obj.description[:50] + '...'
#         return obj.description or '—'
#     description_short.short_description = "Описание"
    
#     def date_added_formatted(self, obj):
#         return timezone.localtime(obj.date_added).strftime('%d.%m.%Y %H:%M')
#     date_added_formatted.short_description = "Дата и время"


# @admin.register(Employee)
# class EmployeeAdmin(admin.ModelAdmin):
#     list_display = ('name',)
#     search_fields = ('name',)


# @admin.register(Lead)
# class LeadAdmin(admin.ModelAdmin):
#     list_display = ('name', 'phone_number', 'comment_short', 'created_at_formatted', 'status_badge')
#     list_filter = ('created_at',)
#     search_fields = ('name', 'phone_number', 'comment')
#     readonly_fields = ('created_at', 'comment_full')
#     ordering = ('-created_at',)
#     date_hierarchy = 'created_at'
#     list_per_page = 50
#     fieldsets = (
#         ('Контактная информация', {
#             'fields': ('name', 'phone_number')
#         }),
#         ('Детали заявки', {
#             'fields': ('comment_full',)
#         }),
#         ('Дата', {
#             'fields': ('created_at',),
#             'classes': ('collapse',)
#         }),
#     )
    
#     def comment_short(self, obj):
#         if len(obj.comment) > 50:
#             return obj.comment[:50] + '...'
#         return obj.comment or '—'
#     comment_short.short_description = "Комментарий"
    
#     def comment_full(self, obj):
#         return obj.comment or '—'
#     comment_full.short_description = "Полный комментарий"
    
#     def created_at_formatted(self, obj):
#         return timezone.localtime(obj.created_at).strftime('%d.%m.%Y %H:%M')
#     created_at_formatted.short_description = "Дата создания"
    
#     def status_badge(self, obj):
#         hours_ago = (timezone.now() - obj.created_at).total_seconds() / 3600
#         if hours_ago < 1:
#             return format_html('<span style="color: green; font-weight: bold;">🆕 Новая (менее часа)</span>')
#         elif hours_ago < 24:
#             return format_html('<span style="color: orange; font-weight: bold;">⏳ Сегодня</span>')
#         else:
#             days = int(hours_ago / 24)
#             return format_html('<span style="color: blue;">📅 {} д. назад</span>', days)
#     status_badge.short_description = "Статус"


# # Настройка заголовка админ-панели
# admin.site.site_header = "dukenCRM - Административная панель"
# admin.site.site_title = "dukenCRM"
# admin.site.index_title = "Главная панель управления"

# # Регистрация дополнительных действий
# def mark_as_confirmed(modeladmin, request, queryset):
#     queryset.update(status='confirmed', arrival_date=timezone.now())
# mark_as_confirmed.short_description = "✅ Отметить как подтвержденные"

# def mark_as_pending(modeladmin, request, queryset):
#     queryset.update(status='pending', arrival_date=None)
# mark_as_pending.short_description = "⏳ Отметить как ожидающие"

# def mark_as_delivered(modeladmin, request, queryset):
#     queryset.update(status='delivered')
# mark_as_delivered.short_description = "🚚 Отметить как доставленные"

# def mark_as_cancelled(modeladmin, request, queryset):
#     queryset.update(status='cancelled')
# mark_as_cancelled.short_description = "✗ Отметить как отмененные"

# def mark_as_paid(modeladmin, request, queryset):
#     queryset.update(repaid_at=timezone.now())
# mark_as_paid.short_description = "✅ Отметить как погашенные"

# def mark_as_invalid(modeladmin, request, queryset):
#     queryset.update(is_valid=False)
# mark_as_invalid.short_description = "✗ Отметить как недействительные"

# # Добавление действий к моделям
# SupplyAdmin.actions = [mark_as_confirmed, mark_as_pending, mark_as_delivered, mark_as_cancelled]
# ClientDebtAdmin.actions = [mark_as_paid, mark_as_invalid]
# LeadAdmin.actions = ['delete_selected']