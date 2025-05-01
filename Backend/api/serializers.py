from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Category, Transaction

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "email","password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class CategorySerializer(serializers.ModelSerializer):
<<<<<<< HEAD
    class Meta:
        model = Category
        fields = ["name", "icon", "color", "author"]
        extra_kwargs = {"author": {"read_only": True}}

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ["title", "trans_date", "category", "amount", "description", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}
=======
    total_amount = serializers.SerializerMethodField()
    parent = serializers.PrimaryKeyRelatedField(
        queryset = Category.objects.all(), required=False, allow_null=True
    )

    class Meta:
        model = Category
        fields = ["id", "name", "icon", "color", "parent", "author", "total_amount"]
        extra_kwargs = {"author": {"read_only": True}}

    def get_total_amount(self,obj):
        return obj.total_amount()

class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = ["id", "title", "trans_date", "category", "category_name", "amount", "description", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None
>>>>>>> 42bcd603708e1c63efc7aa3da7865093b98c37bd
