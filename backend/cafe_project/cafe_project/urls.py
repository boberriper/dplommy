from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from menu.views import CategoryViewSet, MenuItemViewSet
from orders.views import OrderViewSet, AccessCodeViewSet
from django.http import HttpResponse

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'menu', MenuItemViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'access-codes', AccessCodeViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
path('', lambda request: HttpResponse('Welcome to Vkusnyy Mot API. Use /api/ for API endpoints or /admin/ for admin panel.')),
]
