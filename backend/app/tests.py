from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User

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
