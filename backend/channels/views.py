from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from .models import Channel

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
