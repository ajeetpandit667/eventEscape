from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Category, Event, RSVP, EventRating, EventImage, UserProfile
from .serializers import (
    CategorySerializer, EventSerializer, EventDetailSerializer, EventCreateSerializer,
    RSVPSerializer, EventRatingSerializer, EventImageSerializer, UserProfileSerializer,
    UserSerializer
)

@csrf_exempt
def api_root(request):
    """API Root - Shows available endpoints"""
    return JsonResponse({
        'message': 'EventEscape API is running!',
        'endpoints': {
            'events': '/api/events/',
            'categories': '/api/categories/',
            'rsvps': '/api/rsvps/',
            'ratings': '/api/ratings/',
            'profile': '/api/profile/',
            'admin': '/admin/',
        },
        'status': 'success'
    })

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['start_date', 'created_at', 'average_rating']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EventDetailSerializer
        elif self.action == 'create':
            return EventCreateSerializer
        return EventSerializer

    def get_queryset(self):
        queryset = Event.objects.all()
        # Filter by upcoming events
        upcoming = self.request.query_params.get('upcoming', None)
        if upcoming is not None:
            from django.utils import timezone
            queryset = queryset.filter(start_date__gte=timezone.now())
        
        # Filter by location (radius search)
        lat = self.request.query_params.get('lat', None)
        lng = self.request.query_params.get('lng', None)
        radius = self.request.query_params.get('radius', 10)  # Default 10km
        
        if lat and lng:
            # Simple distance filtering (you might want to use GeoDjango for better performance)
            from django.db.models import Q
            lat, lng = float(lat), float(lng)
            radius = float(radius)
            # This is a simplified version - consider using PostGIS for production
            queryset = queryset.filter(
                latitude__range=(lat - radius/111, lat + radius/111),
                longitude__range=(lng - radius/111, lng + radius/111)
            )
        
        return queryset

    @action(detail=True, methods=['post'])
    def rsvp(self, request, pk=None):
        event = self.get_object()
        user = request.user
        
        # Check if user already has an RSVP
        rsvp, created = RSVP.objects.get_or_create(
            event=event,
            user=user,
            defaults={'status': 'confirmed'}
        )
        
        if not created:
            # Toggle RSVP status
            rsvp.status = 'cancelled' if rsvp.status == 'confirmed' else 'confirmed'
            rsvp.save()
        
        serializer = RSVPSerializer(rsvp)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        event = self.get_object()
        user = request.user
        rating_value = request.data.get('rating')
        comment = request.data.get('comment', '')
        
        if not rating_value:
            return Response({'error': 'Rating is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create or update rating
        rating, created = EventRating.objects.get_or_create(
            event=event,
            user=user,
            defaults={'rating': rating_value, 'comment': comment}
        )
        
        if not created:
            rating.rating = rating_value
            rating.comment = comment
            rating.save()
        
        # Update event's average rating
        ratings = event.ratings.all()
        if ratings:
            event.average_rating = sum(r.rating for r in ratings) / len(ratings)
            event.total_ratings = len(ratings)
            event.save()
        
        serializer = EventRatingSerializer(rating)
        return Response(serializer.data)

class RSVPViewSet(viewsets.ModelViewSet):
    serializer_class = RSVPSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RSVP.objects.filter(user=self.request.user)

class EventRatingViewSet(viewsets.ModelViewSet):
    serializer_class = EventRatingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EventRating.objects.filter(user=self.request.user)

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    def get_object(self):
        return UserProfile.objects.get_or_create(user=self.request.user)[0]
