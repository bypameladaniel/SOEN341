from django.urls import path
from .views import channel_list
from . import views
from .views import join_channel, add_message

urlpatterns = [
    #path('channel-list/', channel_list, name='channel-list'),
    path('', channel_list, name='channel-list'),
    path('join/<int:channel_id>/', views.join_channel, name='join-channel'),
    path('channels/<int:channel_id>/messages/', views.add_message, name='add-message') # new path for adding message to id (not working)
]