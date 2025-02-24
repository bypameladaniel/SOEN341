from django.contrib import admin
from .models import Channel, Message

# Register your models here.
class ChannelAdmin(admin.ModelAdmin):
    model = Channel
    list_display = ('name', 'picture', 'get_members') 

    def get_members(self, obj):
        return ", ".join([user.username for user in obj.members.all()])
    get_members.short_description = 'Members'


class MessageAdmin(admin.ModelAdmin):
    model = Message
    list_display = ('content', 'user', 'channel', 'timestamp')

admin.site.register(Channel, ChannelAdmin)
admin.site.register(Message, MessageAdmin)