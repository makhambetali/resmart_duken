from rest_framework import serializers
from .models import Supplier, Supply, SupplyImage, Client, ClientDebt, CashFlow, Employee, UserProfile
from django.utils import timezone
from django.core.cache import cache
import logging
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

logger = logging.getLogger('app')
class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'
    

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class SupplyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplyImage
        fields = ['id', 'image']


class SupplySerializer(serializers.ModelSerializer):
    supplier = serializers.SlugRelatedField(
        queryset=Supplier.objects.all(),
        slug_field='name'
    )
    images = SupplyImageSerializer(many=True, required=False)

    class Meta:
        model = Supply
        fields = '__all__'

class SupplierCustomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['id','name', 'is_everyday_supply']

class ClientDebtSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientDebt
        exclude = ['client']
    

class CashFlowSerializer(serializers.ModelSerializer):
    class Meta:
        model = CashFlow
        fields = '__all__'
    
    def validate_amount(self, value):
        if value == 0:
            raise serializers.ValidationError('Сумма не должна быть равна нулю')
        
        return value
    
    

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['role', 'created_at']

# serializers.py - обновите UserSerializer.create()
class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'password2', 'profile']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Пароли не совпадают"})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        
        # Создаем пользователя
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        
        # Используем get_or_create для профиля
        UserProfile.objects.get_or_create(
            user=user,
            defaults={'role': UserProfile.Role.EMPLOYEE}
        )
        
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            raise serializers.ValidationError("Необходимо указать имя пользователя и пароль")
        
        return data