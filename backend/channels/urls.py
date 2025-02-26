from django.urls import path
from .views import channel_list, list_messages_in_channel
    
#every url defined in this folder will AUTOMATICALLY start with /channels 
urlpatterns = [
    #path('channel-list/', channel_list, name='channel-list'),  
    path('', channel_list, name='channel-list'),
    path('<int:channel_id>/messages/', list_messages_in_channel, name='message-list')  

]
