"""
Custom permissions for Auth0 authenticated users.
"""

from rest_framework import permissions


class IsAuth0Authenticated(permissions.BasePermission):
    """
    Allow access only to users authenticated via Auth0 (have session with user info).
    """

    def has_permission(self, request, view):
        return 'user' in request.session and 'userinfo' in request.session.get('user', {})
