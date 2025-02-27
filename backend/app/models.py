from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # AbstractUser class has username and password fields as required
    POSSIBLE_ROLES = (
        ('admin', 'Admin'),
        ('member', 'Member'),
    )
    role = models.CharField(max_length=6, choices=POSSIBLE_ROLES, default='member')
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)