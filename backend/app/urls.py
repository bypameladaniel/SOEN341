from django.urls import path
from . import views
from .views import ReactAppView

urlpatterns = [
    #path('', views.home, name='home'),
    path('', ReactAppView.as_view(), name='react_app'),
    # Add other URL patterns here
]