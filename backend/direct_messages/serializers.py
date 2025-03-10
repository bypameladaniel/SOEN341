from rest_framework import serializers
from .models import DirectMessage
from app.serializers import UserSerializer 
 
class DirectMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
 
    class Meta:
         model = DirectMessage
         fields = ['id', 'sender', 'receiver', 'message', 'timestamp']
         read_only_fields = ['sender', 'timestamp']



class SendMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DirectMessage
        #fields = ['receiver', 'message'] 
        fields = ['id', 'sender', 'receiver', 'message', 'timestamp']
        read_only_fields = ['sender', 'timestamp']
        extra_kwargs = {
            'receiver': {'required': True},
            'message': {'required': True},
        }

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return DirectMessage.objects.create(**validated_data)