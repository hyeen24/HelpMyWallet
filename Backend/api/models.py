# models.py
from django.db import models
from django.contrib.auth.models import User
from treebeard.mp_tree import MP_Node
from django.db.models import Sum
from django.contrib.postgres.fields import ArrayField
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

def upload_merchant_path(instance, filename):
    return f'{instance.author.username}/merchants/{filename}'

def upload_document_path(instance, filename):
    return f'{instance.author.username}/documents/{filename}'


class Merchant(models.Model):
    name = models.CharField(max_length=100)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="merchants")
    icon = models.ImageField(upload_to=upload_merchant_path, blank=True, null=True)
    keywords = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.name

class PDFDocument(models.Model):
    name = models.CharField(max_length=100)
    file = models.FileField(upload_to=upload_document_path, blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="documents", null=True, blank=True)

    def __str__(self):
        return self.name

class Transaction(models.Model):
    ref_number = models.CharField(max_length=100, unique=True, blank=False, null=False)
    transaction_date = models.DateTimeField()
    post_date = models.DateTimeField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions")
    
    category_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    category_id = models.PositiveIntegerField()
    category = GenericForeignKey('category_type', 'category_id')
    
    def __str__(self):
        return self.ref_number
    
class Income(models.Model):
    RECUR_CHOICES  = [
        ('daily','Daily'),
        ('once','Once'),
        ('monthly','Monthly'),
        ('yearly','Yearly')
    ]

    name = models.CharField(max_length=100)
    recurrence = models.CharField(max_length=10, choices=RECUR_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="incomes")

class Expense(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="expenses")
    merchant = models.ForeignKey(Merchant, on_delete=models.SET_NULL, related_name="expenses", null=True, blank=True)