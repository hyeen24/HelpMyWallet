from django.urls import path
from . import views

urlpatterns = [
    path("categories/", views.CategoryListCreate.as_view(), name="category-list"),
    path("transactions/", views.TransactionListCreate.as_view(), name="transaction-list"),
    path("category/delete/<int:pk>/",views.CategoryDelete.as_view(), name="delete-category"),

]