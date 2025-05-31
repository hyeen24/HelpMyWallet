# models.py
from django.db import models
from django.contrib.auth.models import User
from treebeard.mp_tree import MP_Node
from django.db.models import Sum

def upload_merchant_path(instance, filename):
    return f'{instance.author.username}/merchants/{filename}'

def upload_document_path(instance, filename):
    return f'{instance.author.username}/documents/{filename}'

class Category(MP_Node):
    name = models.CharField(max_length=50)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="categories")
    icon = models.CharField(max_length=100, blank=True, null=True)
    icon_type = models.CharField(max_length=50, blank=True, null=True)
    color = models.CharField(max_length=7, blank=True, null=True)
    node_order_by = ['name']

    def __str__(self):
        return self.name


class Transaction(models.Model):
    title = models.CharField(max_length=100)
    trans_date = models.DateTimeField()
    category = models.ForeignKey(
        Category,
        related_name="transactions",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions")
    merchant = models.ForeignKey(
        'Merchant',
        related_name="transactions",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def __str__(self):
        return self.title

class Merchant(models.Model):
    name = models.CharField(max_length=100, unique=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="merchants")
    icon = models.ImageField(upload_to=upload_merchant_path, blank=True, null=True)

    def __str__(self):
        return self.name

class PDFDocument(models.Model):
    name = models.CharField(max_length=100)
    file = models.FileField(upload_to=upload_document_path, blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="documents", null=True, blank=True)

    def __str__(self):
        return self.name
