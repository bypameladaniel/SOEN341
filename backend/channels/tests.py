from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Channel

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
