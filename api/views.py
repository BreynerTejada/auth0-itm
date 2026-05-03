"""Django REST Framework ViewSets for user profile and metadata."""

import logging
from django.conf import settings
from auth0.management import ManagementClient
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .permissions import IsAuth0Authenticated
from .serializers import UserMetadataSerializer

logger = logging.getLogger(__name__)


class UserViewSet(viewsets.ViewSet):

    permission_classes = [IsAuth0Authenticated]

    def _get_management_client(self):
        return ManagementClient(
            domain=settings.AUTH0_DOMAIN,
            client_id=settings.AUTH0_MANAGEMENT_CLIENT_ID,
            client_secret=settings.AUTH0_MANAGEMENT_CLIENT_SECRET,
        )

    def _get_auth0_user(self, user_id):
        mgmt_client = self._get_management_client()
        return mgmt_client, mgmt_client.users.get(user_id)

    @action(detail=False, methods=['get'], url_path='profile')
    def profile(self, request):
        try:
            user_id = request.auth0_user_id
            _, user_data = self._get_auth0_user(user_id)
            metadata = user_data.user_metadata or {}

            return Response({
                'email': user_data.email,
                'sub': user_id,
                'picture': user_data.picture,
                'user_metadata': metadata,
            })
        except Exception as exc:
            logger.error('Error fetching user profile: %s', str(exc))
            return Response(
                {'error': f'Error fetching user profile: {str(exc)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=['get'], url_path='metadata')
    def metadata(self, request):
        try:
            user_id = request.auth0_user_id
            _, user_data = self._get_auth0_user(user_id)
            metadata = user_data.user_metadata or {}

            return Response({
                'email': user_data.email,
                'sub': user_id,
                'picture': user_data.picture,
                'user_metadata': {
                    'tipo_documento': metadata.get('tipo_documento', ''),
                    'numero_documento': metadata.get('numero_documento', ''),
                    'direccion': metadata.get('direccion', ''),
                    'telefono': metadata.get('telefono', ''),
                },
            })
        except Exception as exc:
            logger.error('Error retrieving metadata: %s', str(exc))
            return Response(
                {'error': f'Error retrieving user data: {str(exc)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @metadata.mapping.post
    def update_metadata(self, request):
        return self._perform_metadata_update(request)

    @action(detail=False, methods=['post'], url_path='metadata/update')
    def metadata_update(self, request):
        return self._perform_metadata_update(request)

    def _perform_metadata_update(self, request):
        try:
            user_id = request.auth0_user_id

            serializer = UserMetadataSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            mgmt_client, user_data = self._get_auth0_user(user_id)
            current_metadata = user_data.user_metadata or {}
            updated_metadata = {**current_metadata}

            for field in ['tipo_documento', 'numero_documento', 'direccion', 'telefono']:
                if field in serializer.validated_data:
                    value = serializer.validated_data[field]
                    if value:
                        updated_metadata[field] = value

            mgmt_client.users.update(user_id, user_metadata=updated_metadata)
            logger.info('Updated metadata for user %s', user_id)

            return Response(
                {
                    'message': 'User metadata updated successfully',
                    'user_metadata': updated_metadata,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as exc:
            logger.error('Error updating metadata: %s', str(exc))
            return Response(
                {'error': f'Error updating user data: {str(exc)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
