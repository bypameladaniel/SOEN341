from django.urls import path
from .views import channel_list, list_messages_in_channel
from . import views
from .views import join_channel

    
# Every url defined in this folder will AUTOMATICALLY start with api/channels 
urlpatterns = [
    path('channel-list/', channel_list, name='channel-list'),   
    path('join/<str:channel_name>/', views.join_channel, name='join-channel'),
    path('<str:channel_name>/messages/', list_messages_in_channel, name='message-list'),
    path('create/', views.create_channel, name='create-channel'),
    path('delete/<str:channel_name>/', views.delete_channel, name='delete-channel'),
    path('message/add/', views.add_message, name='add-message'),
    path('message/delete/<str:channel_name>/', views.delete_message, name='delete-message'),
]

