"""Auth0 authentication endpoints exposed as a DRF ViewSet."""

import logging
from urllib.parse import urlencode

from authlib.integrations.django_client import OAuth
from django.conf import settings
from django.shortcuts import redirect
from django.urls import reverse
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

logger = logging.getLogger(__name__)

oauth = OAuth()

if settings.AUTH0_DOMAIN and settings.AUTH0_CLIENT_ID and settings.AUTH0_CLIENT_SECRET:
    oauth.register(
        'auth0',
        client_id=settings.AUTH0_CLIENT_ID,
        client_secret=settings.AUTH0_CLIENT_SECRET,
        client_kwargs={'scope': 'openid profile email'},
        server_metadata_url=f'https://{settings.AUTH0_DOMAIN}/.well-known/openid-configuration',
    )



class Auth0ViewSet(viewsets.ViewSet):
    """Auth0 login flow endpoints using ViewSet actions."""

    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'], url_path='login')
    def login(self, request):
        try:
            callback_url = request.build_absolute_uri(reverse('auth0-callback'))
            return oauth.auth0.authorize_redirect(request, callback_url)
        except Exception as exc:
            logger.error('Login error: %s', str(exc))
            return redirect(f'{settings.FRONTEND_URL}/?error=login_unavailable')

    @action(detail=False, methods=['get'], url_path='callback')
    def callback(self, request):
        try:
            token = oauth.auth0.authorize_access_token(request)
            request.session['user'] = token
            logger.info('User authenticated: %s', token.get('userinfo', {}).get('email'))
            return redirect(settings.FRONTEND_URL)
        except Exception as exc:
            logger.error('Callback error: %s', str(exc))
            return redirect(f'{settings.FRONTEND_URL}/?error=auth_failed')

    @action(detail=False, methods=['get'], url_path='logout')
    def logout(self, request):
        request.session.clear()
        return redirect(
            f'https://{settings.AUTH0_DOMAIN}/v2/logout?'
            + urlencode(
                {
                    'returnTo': settings.FRONTEND_URL,
                    'client_id': settings.AUTH0_CLIENT_ID,
                }
            )
        )

    @action(detail=False, methods=['get'], url_path='user-info')
    def user_info(self, request):
        user = request.session.get('user', {})
        if user:
            return Response(
                {
                    'authenticated': True,
                    'user': {
                        'email': user.get('userinfo', {}).get('email'),
                        'name': user.get('userinfo', {}).get('name'),
                        'sub': user.get('userinfo', {}).get('sub'),
                    },
                },
                status=status.HTTP_200_OK,
            )
        return Response({'authenticated': False}, status=status.HTTP_200_OK)
