from django.shortcuts import get_object_or_404
from django.db.models import Avg, F
from django.utils.timezone import now
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Event, Category, UserProfile, Rating
from .serializers import (
    EventSerializer,
    EventDetailSerializer,
    EventCreateSerializer,
    CategorySerializer,
    UserProfileSerializer,
)

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-start_date')
    serializer_class = EventSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EventDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return EventCreateSerializer
        return EventSerializer

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def rsvp(self, request, pk=None):
        event = self.get_object()

        # Check if event has already ended
        if event.end_date and event.end_date < now():
            return Response({"error": "Cannot RSVP to an event that has already ended."},
                            status=status.HTTP_400_BAD_REQUEST)

        profile = request.user.profile
        if event in profile.rsvps.all():
            profile.rsvps.remove(event)
            event.rsvp_count = F('rsvp_count') - 1
            status_msg = "RSVP cancelled."
        else:
            if event.capacity and event.rsvp_count >= event.capacity:
                return Response({"error": "Event is at full capacity."},
                                status=status.HTTP_400_BAD_REQUEST)
            profile.rsvps.add(event)
            event.rsvp_count = F('rsvp_count') + 1
            status_msg = "RSVP confirmed."

        event.save(update_fields=['rsvp_count'])
        event.refresh_from_db()
        return Response({"message": status_msg, "rsvp_count": event.rsvp_count})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def rate(self, request, pk=None):
        event = self.get_object()
        value = request.data.get('rating')

        try:
            value = int(value)
        except (TypeError, ValueError):
            return Response({"error": "Invalid rating value."},
                            status=status.HTTP_400_BAD_REQUEST)

        if not (1 <= value <= 5):
            return Response({"error": "Rating must be between 1 and 5."},
                            status=status.HTTP_400_BAD_REQUEST)

        rating_obj, created = Rating.objects.update_or_create(
            event=event,
            user=request.user,
            defaults={"value": value}
        )

        # Efficient aggregation
        avg_rating = Rating.objects.filter(event=event).aggregate(avg=Avg('value'))['avg'] or 0
        event.rating = avg_rating
        event.save(update_fields=['rating'])

        return Response({
            "message": "Rating submitted." if created else "Rating updated.",
            "average_rating": avg_rating
        })

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
