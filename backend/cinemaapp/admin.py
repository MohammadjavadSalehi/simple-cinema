from django.contrib import admin
from .models import Room, Movie, Screening, Seat, Booking

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'capacity', 'color')
    search_fields = ('name',)

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'duration')
    search_fields = ('title',)

@admin.register(Screening)
class ScreeningAdmin(admin.ModelAdmin):
    list_display = ('movie', 'room', 'start_time')
    list_filter = ('room', 'start_time')
    search_fields = ('movie__title', 'room__name')

@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ('room', 'row', 'number')
    list_filter = ('room',)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('screening', 'seat', 'customer_name', 'booking_time')
    list_filter = ('screening__room', 'screening__movie')
    search_fields = ('customer_name', 'customer_email')
