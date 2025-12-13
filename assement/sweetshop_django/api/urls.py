from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SweetViewSet, RegisterView

router = DefaultRouter()
router.register(r'sweets', SweetViewSet, basename='sweets')

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('', include(router.urls)),
]
