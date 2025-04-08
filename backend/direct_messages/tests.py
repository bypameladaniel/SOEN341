from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import DirectMessage

User = get_user_model()

class SendMessageTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create two users
        self.sender = User.objects.create_user(username='alice', password='testpassword123')
        self.receiver = User.objects.create_user(username='bob', password='testpassword123')

        # Authenticate as sender
        refresh = RefreshToken.for_user(self.sender)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

        self.url = reverse('send-message')

    def test_send_message_successfully(self):
        data = {
            'receiver': self.receiver.id,
            'message': 'Hello Bob, this is Alice!'
        }

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(DirectMessage.objects.count(), 1)
        msg = DirectMessage.objects.first()
        self.assertEqual(msg.sender, self.sender)
        self.assertEqual(msg.receiver, self.receiver)
        self.assertEqual(msg.message, data['message'])

    def test_send_multiple_messages(self):
        messages = ['First message', 'Second message', 'Third message']
        for m in messages:
            response = self.client.post(self.url, {
                'receiver': self.receiver.id,
                'message': m
            }, format='json')
            self.assertEqual(response.status_code, 201)

        self.assertEqual(DirectMessage.objects.count(), 3)

    