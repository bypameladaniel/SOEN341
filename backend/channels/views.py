from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed

from django.conf import settings

from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

from .models import Channel, Message
from .serializers import MessageSerializer
from .serializers import ChannelSerializer


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

@login_required
def join_channel(request, channel_id):
    try:
        channel = Channel.objects.get(id=channel_id)
    except Channel.DoesNotExist:
        return JsonResponse({'error': 'Channel not found'}, status=404)

    user = request.user

    # Check if the user is already a member
    if user in channel.members.all():
        return JsonResponse({'message': 'User is already a member'}, status=200)

    # Add the user to the channel
    channel.members.add(user)
    
    return JsonResponse({'message': 'Successfully joined the channel'}, status=200)

@login_required
def list_messages_in_channel(request, channel_id):
    if request.method == 'GET':
        try:
            # If the Channel does not exist, the user should be redirected to a 404 page
            channel = Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return JsonResponse({'error': 'Channel not found'}, status=404)

        messages = Message.objects.filter(channel=channel).order_by('timestamp')

        serializer = MessageSerializer(messages, many=True)
        return JsonResponse({'messages': serializer.data}, status=200)
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)