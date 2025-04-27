from rest_framework import serializers
from .models import Room, Movie, Screening, Seat, Booking

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = '__all__'

class ScreeningSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    room_name = serializers.CharField(source='room.name', read_only=True)
    
    class Meta:
        model = Screening
        fields = ['id', 'movie', 'room', 'start_time', 'movie_title', 'room_name']

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class SeatStatusSerializer(serializers.ModelSerializer):
    is_booked = serializers.SerializerMethodField()
    
    class Meta:
        model = Seat
        fields = ['id', 'row', 'number', 'is_booked']
    
    def get_is_booked(self, obj):
        screening_id = self.context.get('screening_id')
        if screening_id:
            return Booking.objects.filter(screening_id=screening_id, seat=obj).exists()
        return False 