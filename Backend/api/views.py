from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework import generics
from .serializers import UserSerializer, CategorySerializer, TransactionSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Category, Transaction
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

# Create your views here.
class TransactionListCreate(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user    
        
        return Transaction.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class CategoryListCreate(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        author = self.request.user
        name = serializer.validated_data['name']
        icon = serializer.validated_data.get('icon')
        color = serializer.validated_data.get('color')
        icon_type = serializer.validated_data.get('icon_type')
        parent_name = serializer.validated_data.get('parent_name')

        if parent_name:
            try:
                parent = Category.objects.get(name__iexact=parent_name, author=author)
                new_category = parent.add_child(name=name.title(), icon=icon, color=color, author=author, icon_type=icon_type)
            except Category.DoesNotExist:
                raise ValidationError(f"Parent category '{parent_name}' not found.")
        else:
            new_category = Category.add_root(name=name.title(), icon=icon, color=color, author=author)

        serializer.instance = new_category


class RootCategoryListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        root_categories = Category.get_root_nodes().filter(author=request.user)
        serializer = CategorySerializer(root_categories, many=True)
        return Response(serializer.data)

class CategoryDelete(generics.DestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user