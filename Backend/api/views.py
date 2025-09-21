from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import UserSerializer, TransactionSerializer, MerchantSerializer, PDFDocumentSerializer, IncomeSerializer, ExpenseSerializer
from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Transaction, Merchant, PDFDocument, Income, Expense
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .services.bank_statement_parser import extract_transactions_from_pdf, update_transactions_with_merchant, update_transactions_with_category
from .services.calendar_event import generate_calendar_events_for_income

class TransactionListCreate(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user    
        year = self.request.query_params.get('year')
        month = self.request.query_params.get('month')
        queryset = Transaction.objects.filter(author=user).order_by('-transaction_date')
        print("Year filter:", year)
        print("Month filter:", month)
        if month and year:
            queryset = queryset.filter(transaction_date__year=int(year), transaction_date__month=int(month)).order_by('-transaction_date')
            return queryset
        
        
        merchant = self.request.query_params.get('merchant', None)

        print("Merchant filter:", merchant)
        if merchant:
            queryset = queryset.filter(merchant_id= merchant)
        return queryset
    
        

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class MerchantListCreate(generics.ListCreateAPIView):
    serializer_class = MerchantSerializer  # Replace with actual MerchantSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Merchant.objects.filter(author=self.request.user)  # Replace with actual Merchant queryset
    
    def get_serializer_context(self):
        return {'request': self.request}

    def perform_create(self, serializer):
        merchant_name = serializer.validated_data.get("name")

        # Check if this user already has a merchant with the same name
        if Merchant.objects.filter(author=self.request.user, name=merchant_name).exists():
            raise ValidationError(f"You already have a merchant named '{merchant_name}'.")
    
        if serializer.is_valid():
            merchant = serializer.save(author=self.request.user)
            
        else:
            print(serializer.errors)

class PDFUploadView(generics.CreateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = PDFDocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PDFDocument.objects.filter(author=self.request.user) 

    def perform_create(self, serializer):
        if serializer.is_valid():
            pdfdocument = serializer.save(author=self.request.user)

            pdfdocument_path = pdfdocument.file.path
            print("pdfDocument_path:", pdfdocument_path)
            transactions = extract_transactions_from_pdf(pdfdocument_path, user= self.request.user)
            update_transactions_with_merchant(self.request.user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IncomeListCreate(generics.ListCreateAPIView):
    serializer_class = IncomeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Income.objects.filter(author=self.request.user) 

    def perform_create(self, serializer):
        serializer.save(author=self.request.user) 
        
        generate_calendar_events_for_income(serializer.instance)
        # auto-assign user


class ExpenseListCreate(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(author=self.request.user) 
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)  


# Delete a single Income
class IncomeDetailDeleteView(generics.RetrieveDestroyAPIView):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Income.objects.filter(author=self.request.user)

# Delete a single Expense
class ExpenseDetailDeleteView(generics.RetrieveDestroyAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(author=self.request.user)