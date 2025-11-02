from django.urls import path
from . import views # Import your views

urlpatterns = [
    path('test_api/', views.TestApiView.as_view(), name='test_api'),
    path('save_results/', views.SaveResultsView.as_view(), name='save_results'),
    path('get_results/', views.PresentResultsView.as_view(), name='get_results'),
]