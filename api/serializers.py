"""
DRF Serializers for user metadata.
"""

from rest_framework import serializers


class UserMetadataSerializer(serializers.Serializer):

    tipo_documento = serializers.CharField(
        max_length=50,
        required=False,
        allow_blank=True,
        help_text="Tipo de documento (CC, CE, PAS, etc.)"
    )
    numero_documento = serializers.CharField(
        max_length=50,
        required=False,
        allow_blank=True,
        help_text="Número de documento"
    )
    direccion = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
        help_text="Dirección del usuario"
    )
    telefono = serializers.CharField(
        max_length=20,
        required=False,
        allow_blank=True,
        help_text="Número de teléfono"
    )

    def validate(self, data):
        """Validate that at least one field is provided."""
        if not any(data.values()):
            raise serializers.ValidationError(
                "At least one field must be provided."
            )
        return data


class UserProfileSerializer(serializers.Serializer):
    """Serializer for user profile information."""
    
    email = serializers.EmailField(read_only=True)
    name = serializers.CharField(read_only=True)
    sub = serializers.CharField(read_only=True)
    picture = serializers.URLField(required=False, allow_blank=True)
    user_metadata = UserMetadataSerializer(required=False)

    def get_picture(self, obj):
        """Extract picture from user info."""
        return obj.get('picture', '')
