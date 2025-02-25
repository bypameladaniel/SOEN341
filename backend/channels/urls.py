from django.urls import path
from .views import channel_list

urlpatterns = [
    #path('channel-list/', channel_list, name='channel-list'),  
    path('', channel_list, name='channel-list'),  
]
