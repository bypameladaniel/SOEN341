from django.urls import path
from .views import channel_list
from . import views
from .views import join_channel


urlpatterns = [
    #path('channel-list/', channel_list, name='channel-list'),
    path('', channel_list, name='channel-list'),
    path('join/<int:channel_id>/', views.join_channel, name='join_channel'),
    path('join_channel/', join_channel, name='join_channel'),

]