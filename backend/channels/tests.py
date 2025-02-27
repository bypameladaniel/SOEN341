from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Channel
from django.test import TestCase
from django.contrib.auth import get_user_model
from channels.models import Channel
from django.utils.crypto import get_random_string

User = get_user_model()

class ChannelListViewTest(APITestCase):

    def setUp(self):
        """Set up test data."""
        print("\nSetting up test data...")
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.client.force_authenticate(user=self.user)

        Channel.objects.create(name="Channel 1")
        Channel.objects.create(name="Channel 2")
        print("Test data created: 2 channels and 1 test user.")

    def test_channel_list_authenticated(self):
        """Test that an authenticated user can get the channel list."""
        print("\nRunning test: test_channel_list_authenticated")
        response = self.client.get("/api/channels/channel-list/")
        print(f"Response status code: {response.status_code}")
        print(f"Response data: {response.data}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        print("Authenticated user successfully retrieved the channel list.")

    def test_channel_list_unauthenticated(self):
        """Test that an unauthenticated user gets a 403 Forbidden response."""
        print("\nRunning test: test_channel_list_unauthenticated")
        self.client.logout()
        response = self.client.get("/api/channels/channel-list/")
        print(f"Response status code: {response.status_code}")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        print("Unauthenticated user correctly received a 403 Forbidden response.")

class JoinChannelTest(TestCase):

    def setUp(self):
        # Create a channel called 'Test Channel' for the test
        self.channel_name = 'Test Channel5'
        self.channel = Channel.objects.create(name=self.channel_name)
        print(f"Created channel: {self.channel_name}")  # Print statement to show channel creation

    def test_join_channel(self):
        # Create a unique username
        username = f"user_{get_random_string(length=8)}"
        user = get_user_model().objects.create_user(username=username, password='password')
        print(f"Created user: {username}")  # Print statement to show user creation

        # Specify the existing channel name
        channel_name = 'Test Channel5'

        try:
            # Get the existing channel
            channel = Channel.objects.get(name=channel_name)
            print(f"Retrieved channel: {channel.name}")  # Print to confirm channel retrieval

            # Check if the user is already a member of the channel
            if user in channel.members.all():
                print(f"User {user.username} is already a member of {channel.name}.")  # Print if user is a member
                self.assertIn(user, channel.members.all())
            else:
                # Add the user to the channel
                channel.members.add(user)
                print(f"User {user.username} added to channel {channel.name}.")  # Print when user is added
                self.assertIn(user, channel.members.all())
        except Channel.DoesNotExist:
            self.fail(f"Channel '{channel_name}' does not exist.")
