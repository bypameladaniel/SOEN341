import json
import datetime
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.channel_group_name = f'chat_{self.scope["url_route"]["kwargs"]["channel_name"].replace(" ","_")}'
        print(self.channel_group_name)

        await self.channel_layer.group_add(
            self.channel_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.channel_group_name, 
            self.channel_name 
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        user = text_data_json["user"]
        timestamp = datetime.datetime.now().isoformat()

        await self.channel_layer.group_send(
            self.channel_group_name, {
                "type": "sendMessage",
                "message": message,
                "user": user,
                "timestamp": timestamp
            }
        )

    async def sendMessage(self, event):
        message = event["message"]
        user = event["user"]
        timestamp = event["timestamp"]
        await self.send(text_data=json.dumps({
            "message": message,
            "user": user,
            "timestamp": timestamp
        }))
