from django.urls import path
from .views import list_direct_messages

from .views import UserListView
from .views import SendMessageView
from .views import ConversationView
from .views import list_conversations
# Note that the path start with 'api/direct_messages/'
urlpatterns = [
    path('<int:user_id>/', list_direct_messages, name='list-direct-messages'),
    path('list-users/', UserListView.as_view(), name='user-list'),
    path('send-message/', SendMessageView.as_view(), name='send-message'),
    path('conversation/<int:recipient_id>/', ConversationView.as_view(), name='conversation'),
    path('conversations/', list_conversations, name='list_conversations'),
]
