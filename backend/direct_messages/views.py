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
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.db.models import Q

User = get_user_model()

class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        current_user = self.request.user
        return User.objects.exclude(id=current_user.id)
    
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_conversations(request):
    user = request.user

    messages = DirectMessage.objects.filter(
        Q(sender=user) | Q(receiver=user)
    ).order_by('-timestamp')

    conversations = {}

    for msg in messages:
        other_user = msg.receiver if msg.sender == user else msg.sender
        if other_user.id not in conversations:
            conversations[other_user.id] = {
                'id': other_user.id,
                'username': other_user.username,
                'last_message': msg.message,
                'timestamp': msg.timestamp
            }

    return Response(list(conversations.values()))
