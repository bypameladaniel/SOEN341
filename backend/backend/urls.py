from django.contrib import admin
from django.urls import path, include
from app.views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings 
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path("app/user/register", UserCreate.as_view(), name ="user_create"),
    path("app/token/",TokenObtainPairView.as_view(), name="token_obtain_pair"),
    #path("app/token/",TokenObtainPairView.as_view(), name = "token_refresh"),
    path("app-auth/",include('rest_framework.urls')),
    path("accounts/",include("allauth.urls")),
    path("app/auth/user/",UserDetailView.as_view(), name = "user_detail"),
    path("",include('app.urls')),
    path("channels/", include('channels.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)