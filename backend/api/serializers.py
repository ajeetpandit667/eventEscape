from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Event, RSVP, EventRating, EventImage, UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class EventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventImage
        fields = '__all__'

class EventRatingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = EventRating
        fields = '__all__'

class RSVPSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = RSVP
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    host = UserSerializer(read_only=True)
    rsvp_count = serializers.ReadOnlyField()
    is_upcoming = serializers.ReadOnlyField()
    is_ongoing = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = '__all__'

class EventDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    host = UserSerializer(read_only=True)
    rsvps = RSVPSerializer(many=True, read_only=True)
    ratings = EventRatingSerializer(many=True, read_only=True)
    images = EventImageSerializer(many=True, read_only=True)
    rsvp_count = serializers.ReadOnlyField()
    is_upcoming = serializers.ReadOnlyField()
    is_ongoing = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    interests = CategorySerializer(many=True, read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'

class EventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            'title', 'description', 'category', 'start_date', 'end_date',
            'location', 'latitude', 'longitude', 'address_line_1', 'address_line_2',
            'capacity', 'price', 'is_free', 'cover_image'
        ]
    
    def create(self, validated_data):
        validated_data['host'] = self.context['request'].user
        return super().create(validated_data) 