from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone

# -----------------------
# Category Model
# -----------------------
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


# -----------------------
# Event Model
# -----------------------
class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, related_name='events', on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    location = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    capacity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    is_free = models.BooleanField(default=True)  # Will be overridden in save()
    created_by = models.ForeignKey(User, related_name='events', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        # Validate that end_date is after start_date
        if self.end_date <= self.start_date:
            raise ValidationError("End date must be after start date.")

        # Check capacity against RSVP count if object already exists
        if self.pk:
            rsvp_count = self.rsvps.count()
            if self.capacity < rsvp_count:
                raise ValidationError("Capacity cannot be less than current RSVP count.")

    def save(self, *args, **kwargs):
        # Auto-set is_free based on price
        self.is_free = (self.price == 0)
        self.full_clean()  # Run validations
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


# -----------------------
# RSVP Model
# -----------------------
class RSVP(models.Model):
    user = models.ForeignKey(User, related_name='rsvps', on_delete=models.CASCADE)
    event = models.ForeignKey(Event, related_name='rsvps', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'event')

    def __str__(self):
        return f"{self.user.username} RSVP'd to {self.event.title}"


# -----------------------
# Event Rating Model
# -----------------------
class EventRating(models.Model):
    event = models.ForeignKey(Event, related_name='ratings', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='event_ratings', on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()
    review = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'user')

    def __str__(self):
        return f"{self.user.username} rated {self.event.title} - {self.rating}"


# -----------------------
# User Profile Model
# -----------------------
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    def __str__(self):
        return self.user.username
# -----------------------
# Event Image Model
# -----------------------
class EventImage(models.Model):
    event = models.ForeignKey(Event, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='event_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.event.title}"
