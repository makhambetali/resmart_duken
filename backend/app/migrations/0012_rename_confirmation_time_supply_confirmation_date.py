# Generated by Django 5.2.1 on 2025-05-18 07:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0011_supply_confirmation_time'),
    ]

    operations = [
        migrations.RenameField(
            model_name='supply',
            old_name='confirmation_time',
            new_name='confirmation_date',
        ),
    ]
