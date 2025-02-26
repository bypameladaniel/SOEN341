from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Channel, Message
from .serializers import MessageSerializer

def channel_list(request):
    if request.method == "GET":
        channels = Channel.objects.all()  
        
        # Convert queryset to list of dictionaries
        data = []
        for channel in channels:
            data.append({
                "id": channel.id,
                "name": channel.name,
                "picture": request.build_absolute_uri(channel.picture.url) if channel.picture else None,
                "members": list(channel.members.values("id", "username"))  # Extract member info
            })
        
        return JsonResponse(data, safe=False)

    return JsonResponse({"error": "Method not allowed"}, status=405)

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