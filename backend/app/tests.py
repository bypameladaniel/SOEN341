from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

class UserRegistrationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('user_create')
        self.valid_payload = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'Testpassword123!',
            'role': 'member'
        }
        self.duplicate_username_payload = {
            'username': 'existinguser',
            'email': 'existing@example.com',
            'password': 'Testpassword123!',
            'role': 'member'
        }
        User.objects.create_user(
            username='existinguser',
            email='existing@example.com',
            password='testpass123'
        )

    def test_create_user_with_valid_data(self):
        response = self.client.post(
            self.register_url,
            data=self.valid_payload,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)  
        
        user = User.objects.get(username=self.valid_payload['username'])
        self.assertEqual(user.email, self.valid_payload['email'])
        self.assertTrue(user.check_password(self.valid_payload['password']))
        self.assertEqual(user.role, self.valid_payload['role'])

    def test_duplicate_username(self):
        response = self.client.post(
            self.register_url,
            data=self.duplicate_username_payload,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
        self.assertEqual(User.objects.count(), 1)  

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

    def test_logout_with_expired_token(self):
        #Test that logout fails when using an expired refresh token
        print("\nRunning test_logout_with_expired_token...")
            
        # Create an expired token
        print("Generating an expired refresh token...")
        expired_refresh = RefreshToken.for_user(self.user)
        expired_refresh.set_exp(lifetime=-timezone.timedelta(days=1))  # Set expiration to 1 day ago
        expired_token = str(expired_refresh)
        
        print("Attempting logout with expired refresh token...")
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        data = {'refresh': expired_token}
        response = self.client.post(self.logout_url, data, format='json')
        
        print(f"Received status code: {response.status_code}")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        print("test_logout_with_expired_token passed\n")