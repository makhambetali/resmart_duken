from rest_framework import serializers
from .models import Supplier, Supply, SupplyImage, Client, ClientDebt, CashFlow
from django.utils import timezone

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
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

    class Meta:
        model = Supply
        fields = '__all__'

    def create(self, validated_data):
        request = self.context.get('request')
        images = request.FILES.getlist('images')
        supply = Supply.objects.create(**validated_data)
        supply.supplier.last_accessed = timezone.now()
        supply.supplier.save()
        for image in images:
            SupplyImage.objects.create(supply=supply, image=image)
        return supply

    def update(self, instance, validated_data):
        request = self.context.get('request')
        images = request.FILES.getlist('images')
        if images:
            instance.images.all().delete()
            for image in images:
                SupplyImage.objects.create(supply=instance, image=image)
        return super().update(instance, validated_data)


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