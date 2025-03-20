from django.urls import path
from .views import list_direct_messages
from . import views
    
urlpatterns = [
    path('<int:user_id>/', list_direct_messages, name='list-direct-messages'),
]


