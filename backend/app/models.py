from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    POSSIBLE_ROLES = (
        ('admin', 'Admin'),
        ('member', 'Member'),
    )
    role = models.CharField(max_length=6, choices=POSSIBLE_ROLES, default='member')
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)

    def is_admin(self):
        return self.role == 'admin'