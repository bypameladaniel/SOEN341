# Standard library imports
from django.conf import settings

# Django imports
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

# Third-party imports
#from rest_framework.decorators import api_view
#from rest_framework.response import Response


# Local imports
from .models import Channel

def channel_list(request):
    if request.method == "GET":
        channels = Channel.objects.all()  
        data = []
        for channel in channels:
            data.append({
                "id": channel.id,
                "name": channel.name,
                "picture": request.build_absolute_uri(channel.picture.url) if channel.picture else None,
                "members": list(channel.members.values("id", "username"))  
            })
        
        return JsonResponse(data, safe=False)

    return JsonResponse({"error": "Method not allowed"}, status=405)


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

# Where Brandon left off
import json
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from .models import Channel, Message

@csrf_exempt  # Disable CSRF protection for simplicity (use only in development)
@login_required
def add_message(request, channel_id):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        channel = Channel.objects.get(id=channel_id)
    except Channel.DoesNotExist:
        return JsonResponse({"error": "Channel not found"}, status=404)

    user = request.user

    # Check if the user is a member of the channel
    if user not in channel.members.all():
        return JsonResponse({"error": "You are not a member of this channel"}, status=403)

    try:
        data = json.loads(request.body)
        content = data.get("content", "").strip()
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    if not content:
        return JsonResponse({"error": "Message content cannot be empty"}, status=400)

    # Create and save the new message
    message = Message.objects.create(channel=channel, user=user, content=content)

    return JsonResponse({
        "id": message.id,
        "channel": channel.id,
        "user": message.user.username,
        "content": message.content,
        "timestamp": message.timestamp.isoformat(),
    }, status=201)
