from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory, force_authenticate
from direct_messages.views import list_direct_messages
from direct_messages.models import DirectMessage

User = get_user_model()

class DirectMessageTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

        # Create users
        self.user1 = User.objects.create_user(username='user1', password='pass1234')
        self.user2 = User.objects.create_user(username='user2', password='pass1234')

        # Create messages
        DirectMessage.objects.create(sender=self.user1, receiver=self.user2, message="Hello from user1")
        DirectMessage.objects.create(sender=self.user2, receiver=self.user1, message="Hey there!")

    def test_list_direct_messages(self):
        request = self.factory.get(f'/api/direct_messages/{self.user2.id}/')
        force_authenticate(request, user=self.user1)

        response = list_direct_messages(request, user_id=self.user2.id)

        self.assertEqual(response.status_code, 200)
        self.assertIn('direct_messages', response.data)
        self.assertEqual(len(response.data['direct_messages']), 2)
