from django.urls import path
from .views import UserListView

# Note that the path start with 'api/direct_messages/'
urlpatterns = [
    path('list-users/', UserListView.as_view(), name='user-list'),
]