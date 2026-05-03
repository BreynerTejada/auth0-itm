"""JWT Bearer token validation using Auth0 JWKS."""

import jwt
from jwt import PyJWKClient
from django.conf import settings
from rest_framework import permissions

_jwks_client: PyJWKClient | None = None


def _get_jwks_client() -> PyJWKClient:
    global _jwks_client
    if _jwks_client is None:
        _jwks_client = PyJWKClient(
            f'https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json'
        )
    return _jwks_client


class IsAuth0Authenticated(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('Bearer '):
            return False

        token = auth_header.split(' ', 1)[1]
        try:
            client = _get_jwks_client()
            signing_key = client.get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=['RS256'],
                audience=settings.AUTH0_AUDIENCE,
                issuer=f'https://{settings.AUTH0_DOMAIN}/',
            )
            request.auth0_user_id = payload['sub']
            return True
        except Exception:
            return False
