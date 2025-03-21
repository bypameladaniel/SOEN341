from django.urls import path
from .views import list_direct_messages

from .views import UserListView
from .views import SendMessageView

# Note that the path start with 'api/direct_messages/'
urlpatterns = [
    path('<int:user_id>/', list_direct_messages, name='list-direct-messages'),
    path('list-users/', UserListView.as_view(), name='user-list'),
    path('send-message/', SendMessageView.as_view(), name='send-message'),
]
