from django.db import models
from django.conf import settings

# Create your models here.
class Channel(models.Model):
    name = models.CharField(max_length=255, unique=True)
    picture = models.ImageField(upload_to='channel_pictures/', null=True, blank=True)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="channels")
    
    def __str__(self):
        return self.name
    
    def is_member(self, user):
        return self.members.filter(id=user.id).exists()

class Message(models.Model):
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name="messages")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="messages")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username}: {self.content[:20]}"
    
    def can_delete(self, user):
        return user.is_admin()