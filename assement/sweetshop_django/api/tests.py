from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from .models import Sweet

class APITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(username='admin', password='adminpass')
        self.user = User.objects.create_user(username='user', password='userpass')
        Sweet.objects.create(name='Ladoo', category='Traditional', price='10.50', quantity=100)

    def get_token(self, username, password):
        r = self.client.post('/api/auth/login/', {'username': username, 'password': password}, format='json')
        return r.data.get('access')

    def test_register_login_and_crud(self):
        r = self.client.post('/api/auth/register/', {'username': 't', 'password': 'p'})
        self.assertEqual(r.status_code, 201)
        token = self.get_token('t', 'p')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        r = self.client.get('/api/sweets/')
        self.assertEqual(r.status_code, 200)

    def test_admin_restock_and_delete(self):
        token = self.get_token('admin', 'adminpass')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        sweet = Sweet.objects.first()
        r = self.client.post(f'/api/sweets/{sweet.id}/restock?quantity=5')
        self.assertEqual(r.status_code, 200)
        r = self.client.delete(f'/api/sweets/{sweet.id}/')
        self.assertEqual(r.status_code, 204)
