"""URL configuration for auth0_app using DRF router + ViewSet."""

from rest_framework.routers import SimpleRouter

from .views import Auth0ViewSet

router = SimpleRouter()
router.register(r'', Auth0ViewSet, basename='auth0')

urlpatterns = router.urls
