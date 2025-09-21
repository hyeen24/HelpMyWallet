from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path("transactions/", views.TransactionListCreate.as_view(), name="transaction-list"),
    path("merchants/", views.MerchantListCreate.as_view(), name="merchant-list"),
    path("upload/", views.PDFUploadView.as_view(), name="pdf-upload"),
    # path("merchant/<int:pk>/", views.MerchantDetail.as_view(), name="merchant-detail"),
    path("incomes/", views.IncomeListCreate.as_view(), name="income-list"),
    path('income/<int:pk>/', views.IncomeDetailDeleteView.as_view(), name='income-delete'),
    path("expenses/", views.ExpenseListCreate.as_view(), name="expense-list"),
    path('expense/<int:pk>/', views.ExpenseDetailDeleteView.as_view(), name='expense-delete'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)