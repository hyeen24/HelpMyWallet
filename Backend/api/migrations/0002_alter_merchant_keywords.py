# Generated by Django 4.2.20 on 2025-06-16 12:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='merchant',
            name='keywords',
            field=models.JSONField(blank=True, default=list),
        ),
    ]
