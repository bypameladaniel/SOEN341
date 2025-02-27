from django.urls import path
from .views import channel_list, list_messages_in_channel
from . import views
from .views import join_channel

    
# Every url defined in this folder will AUTOMATICALLY start with api/channels 
urlpatterns = [
    path('channel-list/', channel_list, name='channel-list'),   
    path('join/<int:channel_id>/', views.join_channel, name='join-channel'),
    path('<int:channel_id>/messages/', list_messages_in_channel, name='message-list')  

]
