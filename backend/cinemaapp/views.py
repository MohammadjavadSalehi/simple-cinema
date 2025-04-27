from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Room, Movie, Screening, Seat, Booking
from .serializers import (
    RoomSerializer, 
    MovieSerializer, 
    ScreeningSerializer, 
    SeatSerializer, 
    SeatStatusSerializer,
    BookingSerializer
)

# Create your views here.

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    
    @action(detail=True, methods=['get'])
    def screenings(self, request, pk=None):
        room = self.get_object()
        screenings = Screening.objects.filter(room=room)
        serializer = ScreeningSerializer(screenings, many=True)
        return Response(serializer.data)

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

class ScreeningViewSet(viewsets.ModelViewSet):
    queryset = Screening.objects.all().select_related('movie', 'room')
    serializer_class = ScreeningSerializer
    
    @action(detail=True, methods=['get'])
    def seats(self, request, pk=None):
        screening = self.get_object()
        seats = Seat.objects.filter(room=screening.room)
        serializer = SeatStatusSerializer(
            seats, 
            many=True,
            context={'screening_id': screening.id}
        )
        return Response(serializer.data)

class SeatViewSet(viewsets.ModelViewSet):
    queryset = Seat.objects.all()
    serializer_class = SeatSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        # Check if seat is already booked for this screening
        screening_id = request.data.get('screening')
        seat_id = request.data.get('seat')
        
        if Booking.objects.filter(screening_id=screening_id, seat_id=seat_id).exists():
            return Response(
                {"error": "This seat is already booked for this screening."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return super().create(request, *args, **kwargs)

class RoomScreeningsView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, room_id):
        room = get_object_or_404(Room, pk=room_id)
        screenings = Screening.objects.filter(room=room).select_related('movie')
        serializer = ScreeningSerializer(screenings, many=True)
        return Response(serializer.data)
