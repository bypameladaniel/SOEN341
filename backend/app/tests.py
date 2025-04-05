from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

class UserLoginTestCase(APITestCase):
    def setUp(self):
        # Create a user for testing
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword123',
            first_name='Test',
            last_name='User',
            role='member'
        )

    def test_user_login(self):
        # URL for the login endpoint
        url = reverse('token_obtain_pair')
        
        # Data to be sent in the request
        data = {
            'username': 'testuser',
            'password': 'testpassword123'
        }
        
        # Make a POST request to the login endpoint
        response = self.client.post(url, data, format='json')
        
        # Check if the response status code is 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check if the response contains access and refresh tokens
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_user_login_invalid_credentials(self):
        # URL for the login endpoint
        url = reverse('token_obtain_pair')
        
        # Data to be sent in the request with invalid credentials
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        
        # Make a POST request to the login endpoint
        response = self.client.post(url, data, format='json')
        
        # Check if the response status code is 401 (Unauthorized)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Check if the response contains an error message
        self.assertIn('detail', response.data)

class UserLogoutTestCase(APITestCase):
    def setUp(self):
        """Initial setup for all test methods"""
        print("\n=== Setting up test environment ===")
        
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        print(f"Created test user: {self.user.username} (ID: {self.user.id})")

        # Generate valid tokens for the user
        self.refresh = RefreshToken.for_user(self.user)
        self.access_token = str(self.refresh.access_token)
        self.refresh_token = str(self.refresh)
        print(f"Generated access token: {self.access_token[:15]}...")
        print(f"Generated refresh token: {self.refresh_token[:15]}...")
        
        # URL for logout endpoint
        self.logout_url = reverse('logout')
        print(f"Logout endpoint: {self.logout_url}")
        print("=== Setup complete ===\n")
    
    def test_successful_logout(self):
        #Test that a user can logout successfully with valid refresh token
        print("\nRunning test_successful_logout...")
        print("Authenticating with valid access token...")
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        
        print("Making logout request with valid refresh token...")
        data = {'refresh': self.refresh_token}
        response = self.client.post(self.logout_url, data, format='json')
        
        print(f"Received status code: {response.status_code}")
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)
        
        # Verify token blacklisting
        from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
        is_blacklisted = BlacklistedToken.objects.filter(token__token=self.refresh_token).exists()
        print(f"Refresh token blacklisted: {'YES' if is_blacklisted else 'NO'}")
        self.assertTrue(is_blacklisted)
        
        print("test_successful_logout passed\n")
    
    def test_logout_with_invalid_refresh_token(self):
        #Test that logout fails with an invalid refresh token
        print("\nRunning test_logout_with_invalid_refresh_token...")
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        
        print("Attempting logout with invalid refresh token...")
        data = {'refresh': 'invalid_token'}
        response = self.client.post(self.logout_url, data, format='json')
        
        print(f"Received status code: {response.status_code}")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        print("test_logout_with_invalid_refresh_token passed\n")
    
    def test_logout_without_refresh_token(self):
        #Test that logout fails when no refresh token is provided
        print("\nRunning test_logout_without_refresh_token...")
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        
        print("Attempting logout without refresh token...")
        data = {}  # No refresh token
        response = self.client.post(self.logout_url, data, format='json')
        
        print(f"Received status code: {response.status_code}")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        print("test_logout_without_refresh_token passed\n")
    
    def test_logout_unauthenticated(self):
        #Test that unauthenticated users cannot access the logout endpoint
        print("\nRunning test_logout_unauthenticated...")
        print("Attempting logout without authentication...")
        data = {'refresh': self.refresh_token}
        response = self.client.post(self.logout_url, data, format='json')
        
        print(f"Received status code: {response.status_code}")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        print("test_logout_unauthenticated passed\n")