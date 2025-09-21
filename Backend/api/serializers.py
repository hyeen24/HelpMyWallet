from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Income, Expense, Transaction, Merchant, PDFDocument

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class TransactionSerializer(serializers.ModelSerializer):
    transaction_date = serializers.DateTimeField(format="%d %b %Y")
    class Meta:
        model = Transaction
        fields = "__all__"
        extra_kwargs = {"author": {"read_only": True}}

    
class MerchantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Merchant
        fields = "__all__"
        extra_kwargs = {"author": {"read_only": True}}

    def create(self, validated_data):
        print("Creating Merchant with data:", validated_data)
        return Merchant.objects.create(**validated_data)  # Replace with actual creation logic

class PDFDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDFDocument
        fields = ["id", "name", "file", "author"]
        extra_kwargs = {"author": {"read_only": True}}

    def create(self, validated_data):
        print("Creating Merchant with data:", validated_data)
        return PDFDocument.objects.create(**validated_data)  
    
class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = "__all__"
        extra_kwargs = {"author": {"read_only": True}}

    def create(self, validated_data):
        print("Creating Income with data:", validated_data)
        return Income.objects.create(**validated_data)  # Replace with actual creation logic

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = "__all__"
        extra_kwargs = {"author": {"read_only": True}}

    def create(self, validated_data):
        print("Creating Expense with data:", validated_data)
        return Expense.objects.create(**validated_data)  # Replace with actual creation logic