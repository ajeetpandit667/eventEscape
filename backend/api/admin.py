from django.contrib import admin
from .models import Category, Event, RSVP, EventRating, EventImage, UserProfile



@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'host', 'category', 'start_date', 'status', 'rsvp_count', 'average_rating']
    list_filter = ['status', 'category', 'is_free', 'start_date']
    search_fields = ['title', 'description', 'location']
    readonly_fields = ['created_at', 'updated_at', 'average_rating', 'total_ratings']
    date_hierarchy = 'start_date'

@admin.register(RSVP)
class RSVPAdmin(admin.ModelAdmin):
    list_display = ['event', 'user', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['event__title', 'user__username']

@admin.register(EventRating)
class EventRatingAdmin(admin.ModelAdmin):
    list_display = ['event', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['event__title', 'user__username']

@admin.register(EventImage)
class EventImageAdmin(admin.ModelAdmin):
    list_display = ['event', 'caption', 'created_at']
    search_fields = ['event__title', 'caption']

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'location', 'phone_number']
    search_fields = ['user__username', 'user__email', 'location']
