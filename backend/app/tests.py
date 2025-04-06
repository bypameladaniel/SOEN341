from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
import tempfile
from PIL import Image

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


class ModifyUserViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.modify_url = reverse('modify_user')
        
        # test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            role='member'
        )
        
        # JWT token for authentication
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        
        # image file for profile picture testing
        self.image = tempfile.NamedTemporaryFile(suffix='.jpg')
        img = Image.new('RGB', (100, 100))
        img.save(self.image)
        self.image.seek(0)

    def tearDown(self):
        self.image.close()

    def test_update_username(self):
        data = {'username': 'newusername'}
        response = self.client.put(
            self.modify_url,
            data=data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, 'newusername')

    def test_update_email(self):
        data = {'email': 'newemail@example.com'}
        response = self.client.put(
            self.modify_url,
            data=data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, 'newemail@example.com')

    def test_update_role(self):
        data = {'role': 'admin'}
        response = self.client.put(
            self.modify_url,
            data=data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.role, 'admin')

    def test_update_profile_picture(self):
        data = {'profile_picture': self.image}
        response = self.client.put(
            self.modify_url,
            data=data,
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertIsNotNone(self.user.profile_picture)

    def test_partial_update(self):
        data = {
            'username': 'partialupdate',
            'email': 'partial@example.com'
        }
        response = self.client.put(
            self.modify_url,
            data=data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, 'partialupdate')
        self.assertEqual(self.user.email, 'partial@example.com')

    def test_unauthenticated_access(self):
        self.client.credentials()  
        data = {'username': 'shouldfail'}
        response = self.client.put(
            self.modify_url,
            data=data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_empty_payload(self):
        response = self.client.put(
            self.modify_url,
            data={},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should be valid since all fields are optional