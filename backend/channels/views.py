from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed
from .models import Channel
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
