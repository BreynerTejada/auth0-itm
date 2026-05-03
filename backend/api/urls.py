"""URL configuration for API app using DRF router + ViewSets."""

from rest_framework.routers import SimpleRouter

from .views import UserViewSet

router = SimpleRouter()
router.register(r'user', UserViewSet, basename='user')

urlpatterns = router.urls
