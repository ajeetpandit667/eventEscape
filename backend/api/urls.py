from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, EventViewSet, RSVPViewSet, 
    EventRatingViewSet, UserProfileViewSet, api_root
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'events', EventViewSet)
router.register(r'rsvps', RSVPViewSet, basename='rsvp')
router.register(r'ratings', EventRatingViewSet, basename='rating')
router.register(r'profile', UserProfileViewSet, basename='profile')

urlpatterns = [
    path('', api_root, name='api-root'),
    path('', include(router.urls)),
] 