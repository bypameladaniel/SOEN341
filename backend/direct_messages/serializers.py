from rest_framework import serializers
from .models import DirectMessage
from app.serializers import UserSerializer 
 
class DirectMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)  # still read-only
    # receiver = UserSerializer(read_only=True) ❌ REMOVE this line

    class Meta:
        model = DirectMessage
        fields = ['id', 'sender', 'receiver', 'message', 'timestamp']
        read_only_fields = ['sender', 'timestamp']
