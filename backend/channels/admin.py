from django.contrib import admin
from django.contrib import messages
from django.utils.crypto import get_random_string
from django.contrib.auth import get_user_model
from .models import Channel, Message


def join_channel_action(modeladmin, request, queryset):
    for channel in queryset:
        username = f"user_{get_random_string(length=8)}"
        user = get_user_model().objects.create_user(username=username, password='password')

        if user not in channel.members.all():
            channel.members.add(user)
            messages.success(request, f"User {username} successfully joined the channel '{channel.name}'.")
        else:
            messages.info(request, f"User {username} is already a member of the channel '{channel.name}'.")

join_channel_action.short_description = "Add user to selected channels"

class ChannelAdmin(admin.ModelAdmin):
    model = Channel
    list_display = ('name', 'picture', 'get_members')
    actions = [join_channel_action]  

    def get_members(self, obj):
        return ", ".join([user.username for user in obj.members.all()])
    get_members.short_description = 'Members'

    def get_actions(self, request):
        actions = super().get_actions(request)
        # Optionally, you can filter out actions based on permissions, but it's not necessary here.
        return actions

class MessageAdmin(admin.ModelAdmin):
    model = Message
    list_display = ('content', 'user', 'channel', 'timestamp')

admin.site.register(Channel, ChannelAdmin)
admin.site.register(Message, MessageAdmin)
