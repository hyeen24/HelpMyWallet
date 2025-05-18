from django.contrib import admin
from .models import Category, Transaction

# Register Category model
admin.site.register(Category)

# Register Transaction model if you want to manage transactions in the admin
admin.site.register(Transaction)