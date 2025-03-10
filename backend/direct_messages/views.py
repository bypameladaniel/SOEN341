from django.shortcuts import render
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import DirectMessage
from .serializers import DirectMessageSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_direct_messages(request, user_id):
    User = get_user_model()
    other_user = get_object_or_404(User, id=user_id)
    
    current_user = request.user
    messages = DirectMessage.objects.filter(
        Q(sender=current_user, receiver=other_user) | Q(sender=other_user, receiver=current_user)
    ).order_by('timestamp')

    serializer = DirectMessageSerializer(messages, many=True, context={"request": request})
    return Response({'direct_messages': serializer.data}, status=status.HTTP_200_OK)