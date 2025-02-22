from django.urls import path
from . import views
from .views import ReactAppView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    #path('', views.home, name='home'),
    path('', ReactAppView.as_view(), name='react_app'),
    # Add other URL patterns here
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)