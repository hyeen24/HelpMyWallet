from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import UserSerializer, CategorySerializer, TransactionSerializer, MerchantSerializer, PDFDocumentSerializer, CalendarEventSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Category, Transaction, Merchant, PDFDocument, CalendarEvent
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .services.bank_statement_parser import extract_transactions_from_pdf, update_transactions_with_merchant
from .services.calendar_event import generate_calendar_events_for_income

class TransactionListCreate(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user    
        year = self.request.query_params.get('year')
        month = self.request.query_params.get('month')
        if month and year:
            queryset = Transaction.objects.filter(author=user, trans_date__year=year, trans_date__month=month).order_by('-trans_date')
            return
        
        queryset = Transaction.objects.filter(author=user).order_by('-trans_date')
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
        amount = serializer.validated_data.get('amount')
        recurrence = serializer.validated_data.get('recurrence')
        start_date = serializer.validated_data.get('start_date')
        end_date = serializer.validated_data.get('end_date')

        if parent_name:
            try:
                parent = Category.objects.get(name__iexact=parent_name, author=author)
                new_category = parent.add_child(
                    name=name.title(), 
                    icon=icon, 
                    color=color, 
                    author=author, 
                    icon_type=icon_type, 
                    amount=amount,
                    recurrence=recurrence,
                    start_date=start_date,
                    end_date=end_date
                    )
                generate_calendar_events_for_income(new_category)               
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
    
class MerchantListCreate(generics.ListCreateAPIView):
    serializer_class = MerchantSerializer  # Replace with actual MerchantSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Merchant.objects.filter(author=self.request.user)  # Replace with actual Merchant queryset
    
    def get_serializer_context(self):
        return {'request': self.request}

    def perform_create(self, serializer):
        if serializer.is_valid():
            merchant = serializer.save(author=self.request.user)
            list_of_empty_merchant = Transaction.objects.filter(author=self.request.user, merchant__isnull = True)
            merchant_name = merchant.name
            keywords = merchant.keywords
            possible_names = [ word.upper() for word in keywords] if keywords else []
            possible_names.append(merchant_name.upper())
            
            for transaction in list_of_empty_merchant:
                if any(name in transaction.description for name in possible_names):
                    # update transaction merchant to this merchant.
                    print("Transaction with this merchant: ",transaction)
                    transaction.merchant = merchant
                    transaction.save()
                    print("Updated Transactions:",transaction)
                    print("Transactions updated with merchant name.")

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
    
class MerchantDetail(generics.RetrieveAPIView):
    serializer_class = MerchantSerializer
    permission_classes = [IsAuthenticated]
    queryset = Merchant.objects.all()

    def get_queryset(self):
        # Limit to merchants of the current user only
        return Merchant.objects.filter(author=self.request.user)
    

class CalendarEventListView(generics.ListAPIView):
    serializer_class = CalendarEventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = CalendarEvent.objects.filter(user=user)

        # Optional: filter by year and month if provided in query params
        year = self.request.query_params.get('year')
        month = self.request.query_params.get('month')

        if year and month:
            queryset = queryset.filter(date__year=year, date__month=month)

        return queryset
