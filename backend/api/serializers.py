from rest_framework import serializers
from .models import Category, Event, RSVP, EventRating, UserProfile

# ---------------------------
# Category
# ---------------------------
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


# ---------------------------
# Event Serializers
# ---------------------------
class EventSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    rsvp_count = serializers.IntegerField(read_only=True)
    is_upcoming = serializers.BooleanField(read_only=True)
    is_ongoing = serializers.BooleanField(read_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'category', 'category_id',
            'start_date', 'end_date', 'location', 'latitude', 'longitude',
            'capacity', 'price', 'is_free', 'image', 'created_by',
            'rsvp_count', 'is_upcoming', 'is_ongoing'
        ]


class EventCreateSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category'
    )

    class Meta:
        model = Event
        fields = [
            'title', 'description', 'category_id',
            'start_date', 'end_date', 'location', 'latitude', 'longitude',
            'capacity', 'price', 'is_free', 'image'
        ]


class EventDetailSerializer(EventSerializer):
    ratings = serializers.SerializerMethodField()

    class Meta(EventSerializer.Meta):
        fields = EventSerializer.Meta.fields + ['ratings']

    def get_ratings(self, obj):
        ratings = EventRating.objects.filter(event=obj)
        return EventRatingSerializer(ratings, many=True).data


# ---------------------------
# RSVP
# ---------------------------
class RSVPSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = RSVP
        fields = '__all__'
        read_only_fields = ('user',)


# ---------------------------
# Ratings
# ---------------------------
class EventRatingSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = EventRating
        fields = '__all__'
        read_only_fields = ('user',)


# ---------------------------
# User Profile
# ---------------------------
class UserProfileSerializer(serializers.ModelSerializer):
    interests = CategorySerializer(many=True, read_only=False)  # Allow write access

    class Meta:
        model = UserProfile
        fields = '__all__'
