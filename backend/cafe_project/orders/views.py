from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Order, AccessCode, OrderItem
from .serializers import OrderSerializer, AccessCodeSerializer
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from menu.models import MenuItem
import csv
from django.http import HttpResponse
import random
import string

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        # Выручка по дням
        revenue = Order.objects.filter(created_at__range=[start_date, end_date])\
            .annotate(date=TruncDate('created_at'))\
            .values('date')\
            .annotate(total=Sum('total_price'))\
            .order_by('date')
        
        # Популярные блюда
        popular_items = OrderItem.objects.filter(order__created_at__range=[start_date, end_date])\
            .values('menu_item__name')\
            .annotate(total=Sum('quantity'))\
            .order_by('-total')

        return Response({
            'revenue': list(revenue),
            'popular_items': list(popular_items)
        })

    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="analytics.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Date', 'Total Revenue'])
        
        revenue = Order.objects.filter(created_at__range=[start_date, end_date])\
            .annotate(date=TruncDate('created_at'))\
            .values('date')\
            .annotate(total=Sum('total_price'))\
            .order_by('date')
        
        for item in revenue:
            writer.writerow([item['date'], item['total']])
        
        return response

class AccessCodeViewSet(viewsets.ModelViewSet):
    queryset = AccessCode.objects.all()
    serializer_class = AccessCodeSerializer

    @action(detail=False, methods=['post'])
    def generate(self, request):
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        access_code = AccessCode.objects.create(code=code)
        return Response(AccessCodeSerializer(access_code).data)