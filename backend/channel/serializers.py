from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Channel, Message

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'profile_picture']

class ChannelSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True) #serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)
    members_detail = UserSerializer(many=True, read_only=True)
    picture = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = Channel
        fields = ['id', 'name', 'picture', 'members', 'members_detail']
        
class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    channel = serializers.SlugRelatedField(
    queryset=Channel.objects.all(),  # The queryset to look up the Channel model
    slug_field='name',              # Use the 'name' field to reference the Channel
    )
    timestamp = serializers.DateTimeField(read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'channel', 'user', 'content', 'timestamp']
        read_only_fields = ['timestamp']
        
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
