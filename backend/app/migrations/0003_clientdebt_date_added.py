# Generated by Django 5.2.1 on 2025-05-14 10:29

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_clientdebt'),
    ]

    operations = [
        migrations.AddField(
            model_name='clientdebt',
            name='date_added',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
