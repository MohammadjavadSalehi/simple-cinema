from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'rooms', views.RoomViewSet)
router.register(r'movies', views.MovieViewSet)
router.register(r'screenings', views.ScreeningViewSet)
router.register(r'seats', views.SeatViewSet)
router.register(r'bookings', views.BookingViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('room/<int:room_id>/screenings/', views.RoomScreeningsView.as_view(), name='room-screenings'),
] 