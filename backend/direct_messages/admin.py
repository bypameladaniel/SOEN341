from django.contrib import admin
from .models import DirectMessage

@admin.register(DirectMessage)
class DirectMessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'message', 'timestamp')
    search_fields = ('sender__username', 'receiver__username', 'message')
    ordering = ('-timestamp',)
