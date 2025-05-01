from django.db import models
from django.contrib.auth.models import User
from treebeard.mp_tree import MP_Node

# Create your models here.
class Category(MP_Node):
    name = models.CharField(max_length=50)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="categories")
    icon = models.CharField(max_length=100, blank=True, null=True)
    color = models.CharField(max_length=7, blank=True, null=True)
    node_order_by = ['name']

    def total_amount(self):
        return self.transactions.filter(user=self.author).aggregate(total=models.Sum('amount'))['total'] or 0

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
    amount = models.DecimalField(max_digits=1000000000,decimal_places=2)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions")

    def __str__(self):
        return self.title
    

