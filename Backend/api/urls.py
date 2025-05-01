from django.urls import path
from . import views

urlpatterns = [
    path("category/", views.CategoryListCreate.as_view(), name="category-list"),
    path("transaction/", views.TransactionListCreate.as_view(), name="transaction-list"),
    path("category/delete/<int:pk>/",views.CategoryDelete.as_view(), name="delete-category"),

]