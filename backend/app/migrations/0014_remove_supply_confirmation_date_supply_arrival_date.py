# Generated by Django 5.2.1 on 2025-05-18 07:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0013_alter_supply_confirmation_date'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='supply',
            name='confirmation_date',
        ),
        migrations.AddField(
            model_name='supply',
            name='arrival_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
