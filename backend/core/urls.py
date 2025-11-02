from django.urls import path
from . import views # Import your views

urlpatterns = [
    path('test_api/', views.TestApiView.as_view(), name='test_api'),
]