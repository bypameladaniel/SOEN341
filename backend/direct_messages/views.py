from django.shortcuts import render
from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from app.serializers import UserSerializer  
from .models import DirectMessage
from .serializers import DirectMessageSerializer

from django.shortcuts import get_object_or_404
from .models import DirectMessage
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.response import Response

User = get_user_model()

class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        current_user = self.request.user
        return User.objects.exclude(id=current_user.id)
    
class ConversationView(generics.ListAPIView):
    serializer_class = DirectMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        recipient_id = self.kwargs.get("recipient_id")
        recipient = get_object_or_404(User, id=recipient_id)

        return DirectMessage.objects.filter(
            sender=self.request.user, receiver=recipient
        ) | DirectMessage.objects.filter(
            sender=recipient, receiver=self.request.user
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
class SendMessageView(generics.CreateAPIView):
    queryset = DirectMessage.objects.all()
    serializer_class = DirectMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        receiver = self.request.data.get("receiver")  
        if not receiver:
            raise serializers.ValidationError({"receiver": "This field is required."})
        
        receiver = get_object_or_404(User, id=receiver)
        
        serializer.save(sender=self.request.user, receiver=receiver)