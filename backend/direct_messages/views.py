from django.shortcuts import render
from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from app.serializers import UserSerializer  

User = get_user_model()

class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        current_user = self.request.user
        return User.objects.exclude(id=current_user.id)