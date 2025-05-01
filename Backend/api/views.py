
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, CategorySerializer, TransactionSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Category, Transaction

# Create your views here.
class TransactionListCreate(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
<<<<<<< HEAD
        user = self.request.user    
        return Transaction.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

=======
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
>>>>>>> 42bcd603708e1c63efc7aa3da7865093b98c37bd

class CategoryListCreate(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
<<<<<<< HEAD
        user = self.request.user    
        return Category.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)
    
=======
        return Category.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CategoryDelete(generics.DestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(author=self.request.user)
>>>>>>> 42bcd603708e1c63efc7aa3da7865093b98c37bd

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
<<<<<<< HEAD
=======


>>>>>>> 42bcd603708e1c63efc7aa3da7865093b98c37bd
