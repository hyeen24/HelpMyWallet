from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path("categories/", views.CategoryListCreate.as_view(), name="category-list"),
    path("transactions/", views.TransactionListCreate.as_view(), name="transaction-list"),
    path("category/delete/<int:pk>/",views.CategoryDelete.as_view(), name="delete-category"),
    path("categories/root/", views.RootCategoryListView.as_view(), name="root-categories"),
    path("merchants/", views.MerchantListCreate.as_view(), name="merchant-list"),
    path("upload/", views.PDFUploadView.as_view(), name="pdf-upload"),
    path("merchant/<int:pk>/", views.MerchantDetail.as_view(), name="merchant-detail"),
    path("calendar/", views.CalendarEventListView.as_view(), name="calendar-events"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)