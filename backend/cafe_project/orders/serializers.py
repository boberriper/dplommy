from rest_framework import serializers
from .models import Order, OrderItem, AccessCode
from menu.serializers import MenuItemSerializer
from menu.models import MenuItem


class OrderItemSerializer(serializers.ModelSerializer):
    menu_item = MenuItemSerializer(read_only=True)
    menu_item_id = serializers.PrimaryKeyRelatedField(
        queryset=MenuItem.objects.all(), source='menu_item', write_only=True
    )

    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'menu_item_id', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    access_code = serializers.CharField(max_length=10, required=False, allow_null=True)

    class Meta:
        model = Order
        fields = ['id', 'created_at', 'status', 'total_price', 'user', 'access_code', 'items']
        read_only_fields = ['id', 'created_at', 'user']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order

class AccessCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessCode
        fields = ['id', 'code', 'is_used', 'created_at']