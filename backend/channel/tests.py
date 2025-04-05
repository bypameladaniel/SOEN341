from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Channel
from django.test import TestCase
from django.utils.crypto import get_random_string

User = get_user_model()

class ChannelListViewTest(APITestCase):

    def setUp(self):
        print("\nSetting up test data...")
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.client.force_authenticate(user=self.user)

        Channel.objects.create(name="Channel 1")
        Channel.objects.create(name="Channel 2")
        print("Test data created: 2 channels and 1 test user.")

    def test_channel_list_authenticated(self):
        print("\nRunning test: test_channel_list_authenticated")
        response = self.client.get("/api/channels/channel-list/")
        print(f"Response status code: {response.status_code}")
        print(f"Response data: {response.data}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        print("Authenticated user successfully retrieved the channel list.")

    def test_channel_list_unauthenticated(self):
        print("\nRunning test: test_channel_list_unauthenticated")
        self.client.logout()
        response = self.client.get("/api/channels/channel-list/")
        print(f"Response status code: {response.status_code}")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        print("Unauthenticated user correctly received a 401 Unauthorized response.")

class JoinChannelTest(TestCase):

    def setUp(self):
        self.channel_name = 'Test Channel6'
        self.channel = Channel.objects.create(name=self.channel_name)
        print(f"Created channel: {self.channel_name}")  

    def test_join_channel(self):
        username = f"user_{get_random_string(length=8)}"
        user = get_user_model().objects.create_user(username=username, password='password')
        print(f"Created user: {username}")  

        channel_name = 'Test Channel6'

        try:
           
            channel = Channel.objects.get(name=channel_name)
            print(f"Retrieved channel: {channel.name}")  

            if user in channel.members.all():
                print(f"User {user.username} is already a member of {channel.name}.")  
                self.assertIn(user, channel.members.all())
            else:

                channel.members.add(user)
                print(f"User {user.username} added to channel {channel.name}.") 
                self.assertIn(user, channel.members.all())
        except Channel.DoesNotExist:
            self.fail(f"Channel '{channel_name}' does not exist.")


class CreateChannelTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpassword")

        self.user.is_admin = lambda: True
        self.user.save()
        
        self.client.force_authenticate(user=self.user)
        self.create_url = "/api/channels/create/"

    def test_create_channel_authenticated(self):
        print("\nRunning test: test_create_channel_authenticated")
        data = {"name": "New Test Channel"}
        response = self.client.post(self.create_url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["name"], "New Test Channel")
        print("Channel successfully created.")

    def test_create_channel_unauthenticated(self):
        print("\nRunning test: test_create_channel_unauthenticated")
        self.client.logout()
        data = {"name": "New Test Channel"}
        response = self.client.post(self.create_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        print("Unauthenticated user correctly received a 401 Unauthorized response.")
           
class MessageModelTest(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.admin_user = User.objects.create_user(username="adminuser", password="password", is_staff=True)
        self.channel = Channel.objects.create(name="Test Channel")
        
        self.message = Message.objects.create(channel=self.channel, user=self.user, content="Test message content")

    def test_message_creation(self):
        """Test message creation"""
        message = Message.objects.get(id=self.message.id)
        self.assertEqual(message.content, "Test message content")
        self.assertEqual(message.user, self.user)
        self.assertEqual(message.channel, self.channel)

    def test_can_delete_as_admin(self):
        """Test can_delete method for an admin user"""
        self.admin_user.role = 'admin'  
        self.admin_user.save()
        self.assertTrue(self.message.can_delete(self.admin_user))

    def test_message_string_representation(self):
        """Test the string representation of the message"""
        message = self.message
        expected_str = f"{self.user.username}: {self.message.content[:20]}" 
        self.assertEqual(str(message), expected_str)

    def test_can_delete_as_non_admin(self):
        """Test can_delete method for a non-admin user"""
        self.assertFalse(self.message.can_delete(self.user))
