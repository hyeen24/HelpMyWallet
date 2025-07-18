from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Category, Transaction, Merchant, PDFDocument, CalendarEvent

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Category.add_root(name="Income", author=user)
        Category.add_root(name="Expenses", author=user)
        return user
    
class CategorySerializer(serializers.ModelSerializer):
    parent = serializers.SerializerMethodField(read_only=True)
    parent_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Category
        fields = ['id', 'name', 'icon', 'color', 'parent', 'author', 'parent_name','icon_type', 'amount','recurrence','start_date','end_date']
        extra_kwargs = {'author': {'read_only': True}}

    def get_parent(self, obj):
        # Use treebeard's get_parent method to return parent's id or None
        parent = obj.get_parent()
        return parent.id if parent else None

class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    trans_date = serializers.DateTimeField(format="%d %b %Y")

    class Meta:
        model = Transaction
        fields = ["id","ref_number", "trans_date", "category", "category_name", "amount", "description", "created_at", "author","merchant"]
        extra_kwargs = {"author": {"read_only": True}}

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None
    
class MerchantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Merchant
        fields = ["id", "name", "icon", "author", "keywords"]
        extra_kwargs = {"author": {"read_only": True}}

    def create(self, validated_data):
        print("Creating Merchant with data:", validated_data)
        return Merchant.objects.create(**validated_data)  # Replace with actual creation logic

class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        fields = ["user", "income_plan", "title", "date", "amount"]
        extra_kwargs = {"author": {"read_only": True}}


class PDFDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDFDocument
        fields = ["id", "name", "file", "author"]
        extra_kwargs = {"author": {"read_only": True}}

    def create(self, validated_data):
        print("Creating Merchant with data:", validated_data)
        return PDFDocument.objects.create(**validated_data)  