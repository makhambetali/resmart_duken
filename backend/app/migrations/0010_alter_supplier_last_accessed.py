# Generated by Django 5.2.1 on 2025-05-18 06:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_alter_supplier_last_accessed'),
    ]

    operations = [
        migrations.AlterField(
            model_name='supplier',
            name='last_accessed',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
