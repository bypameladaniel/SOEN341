from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed


from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.models import User

from .models import Channel, Message
from .serializers import MessageSerializer
from .serializers import ChannelSerializer
from rest_framework import status


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def channel_list(request):
    try:
        channels = Channel.objects.all()
        serializer = ChannelSerializer(channels, many=True, context={"request": request})
        return Response(serializer.data)
    except AuthenticationFailed:
        return Response({"error": "Authentication failed. Please check your token."}, status=401)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def join_channel(request, channel_id):
    try:
        channel = get_object_or_404(Channel, id=channel_id)
        user = request.user

        
        if user in channel.members.all():
            return Response({'message': 'User is already a member'}, status=200)

        channel.members.add(user)
        serializer = ChannelSerializer(channel, context={"request": request})

        return Response({
            'message': 'Successfully joined the channel',
            'channel': serializer.data
        }, status=200)

    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_messages_in_channel(request, channel_id):
    if request.method == 'GET':
        try:
            channel = Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return JsonResponse({'error': 'Channel not found'}, status=404)

        messages = Message.objects.filter(channel=channel).order_by('timestamp')

        serializer = MessageSerializer(messages, many=True)
        return JsonResponse({'messages': serializer.data}, status=200)
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_channel(request):
    if not request.user.is_admin():
        return Response({"error": "Only admins can create channels"}, status=403)
    
    serializer = ChannelSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
        channel = serializer.save()
        return Response(ChannelSerializer(channel, context={"request": request}).data, status=201)
    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_channel(request, channel_id):
    if not request.user.is_admin():
        return Response({"error": "Only admins can delete channels"}, status=403)
    
    channel = get_object_or_404(Channel, id=channel_id)
    channel.delete()
    return Response({"message": "Channel deleted successfully"}, status=204)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_message(request, channel_id):

    channel = get_object_or_404(Channel, id=channel_id)

    serializer = MessageSerializer(data=request.data, context={"request": request})
        
    if serializer.is_valid():
        serializer.save(user=request.user, channel=channel)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_message(request, message_id):
    message = get_object_or_404(Message, id=message_id)
    if not message.can_delete(request.user):
        return Response({"error": "You do not have permission to delete this message"}, status=403)
    
    message.delete()
    return Response({"message": "Message deleted successfully"}, status=204)