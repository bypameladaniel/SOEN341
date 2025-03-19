from django.contrib import admin
from django.urls import path, include
from app.views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings 
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path("app/user/register/", UserCreate.as_view(), name ="user_create"), #creating user
    path("app/token/",TokenObtainPairView.as_view(), name="token_obtain_pair"), #for login and generating access and refresh tokens
    path("app/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("app/logout/", LogoutView.as_view(), name="logout"),
    path("app/auth/user/",UserDetailView.as_view(), name = "user_detail"),
    path("",include('app.urls')),
    path("api/channels/", include('channel.urls')),
    path("api/direct-messages/", include('direct_messages.urls')),
    path('app/user/modify/', ModifyUserView.as_view(), name='modify_user'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)