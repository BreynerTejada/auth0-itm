"""
URL configuration for auth0 project.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth0/', include('auth0_app.urls')),
    path('api/', include('api.urls')),
]
