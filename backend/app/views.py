from django.shortcuts import render
from django.shortcuts import redirect
from .serializers import UserSerializer
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.views.generic import TemplateView
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from allauth.socialaccount.models import SocialToken, SocialAccount
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .serializers import ChangePasswordSerializer
from django.contrib.auth import update_session_auth_hash
from rest_framework import status
from rest_framework.views import APIView

#@api_view(['GET'])
#def api_example(request):
    #data = {'message': 'Hello from Django!'}
    #return Response(data)

class ReactAppView(TemplateView):
    template_name = 'index.html'  # Ensure this points to your React index.html

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Add any additional context data here
        return context
    
User = get_user_model()

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if not user.check_password(old_password):
                return Response({"old_password": "Wrong password."}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            update_session_auth_hash(request, user)  # Update session to prevent logout
            return Response(status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the refresh token
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)