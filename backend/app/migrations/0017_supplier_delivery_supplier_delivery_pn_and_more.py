# Generated by Django 5.2.1 on 2025-05-28 12:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0016_alter_cashflow_options_alter_client_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='supplier',
            name='delivery',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AddField(
            model_name='supplier',
            name='delivery_pn',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AddField(
            model_name='supplier',
            name='representative',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AddField(
            model_name='supplier',
            name='representative_pn',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AddField(
            model_name='supplier',
            name='supervisor',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AddField(
            model_name='supplier',
            name='supervisor_pn',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.DeleteModel(
            name='SupplierExtraData',
        ),
    ]
