# Generated by Django 4.2.20 on 2025-08-02 08:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_category_amount_category_end_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='amount',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=12, null=True),
        ),
    ]
