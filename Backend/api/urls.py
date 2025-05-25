from django.urls import path
from . import views

urlpatterns = [
    path("categories/", views.CategoryListCreate.as_view(), name="category-list"),
    path("transactions/", views.TransactionListCreate.as_view(), name="transaction-list"),
    path("category/delete/<int:pk>/",views.CategoryDelete.as_view(), name="delete-category"),
    path("categories/root/", views.RootCategoryListView.as_view(), name="root-categories"),
    path("merchants/", views.MerchantListCreate.as_view(), name="merchant-list"),
]