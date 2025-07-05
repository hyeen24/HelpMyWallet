# models.py
from django.db import models
from django.contrib.auth.models import User
from treebeard.mp_tree import MP_Node
from django.db.models import Sum
from django.contrib.postgres.fields import ArrayField

def upload_merchant_path(instance, filename):
    return f'{instance.author.username}/merchants/{filename}'

def upload_document_path(instance, filename):
    return f'{instance.author.username}/documents/{filename}'

class Category(MP_Node):
    RECUR_CHOICES  = [
        ('daily','Daily'),
        ('once','Once'),
        ('monthly','Monthly'),
        ('yearly','Yearly')
    ]

    name = models.CharField(max_length=50)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="categories")
    icon = models.CharField(max_length=100, blank=True, null=True)
    icon_type = models.CharField(max_length=50, blank=True, null=True)
    color = models.CharField(max_length=7, blank=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    recurrence = models.CharField(max_length=10, choices=RECUR_CHOICES, null=True)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True, blank=True)  

    node_order_by = ['name']

    def __str__(self):
        return self.name
    
class CalendarEvent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='calendar_events')
    income_plan = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='events')
    title = models.CharField(max_length=255, default='Income')
    date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name
    
    class Meta:
        unique_together = ('user', 'date', 'income_plan')

class Merchant(models.Model):
    name = models.CharField(max_length=100)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="merchants")
    icon = models.ImageField(upload_to=upload_merchant_path, blank=True, null=True)
    category=models.ForeignKey(Category, on_delete=models.SET_NULL, related_name="merchants", null=True,blank=True)
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
        Merchant,
        related_name="transactions",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def __str__(self):
        return self.ref_number