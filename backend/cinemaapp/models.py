from django.db import models
from django.utils import timezone

class Room(models.Model):
    name = models.CharField(max_length=100)
    capacity = models.IntegerField()
    color = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return self.name

class Movie(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    poster = models.ImageField(upload_to='movie_posters/', null=True, blank=True)
    duration = models.IntegerField(help_text="Duration in minutes")
    
    def __str__(self):
        return self.title

class Screening(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='screenings')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='screenings')
    start_time = models.DateTimeField()
    
    @property
    def end_time(self):
        return self.start_time + timezone.timedelta(minutes=self.movie.duration)
    
    def __str__(self):
        return f"{self.movie.title} at {self.start_time.strftime('%Y-%m-%d %H:%M')} in {self.room.name}"

class Seat(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='seats')
    row = models.CharField(max_length=10)
    number = models.IntegerField()
    
    class Meta:
        unique_together = ('room', 'row', 'number')
    
    def __str__(self):
        return f"{self.room.name} - Row {self.row} Seat {self.number}"

class Booking(models.Model):
    screening = models.ForeignKey(Screening, on_delete=models.CASCADE, related_name='bookings')
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE, related_name='bookings')
    customer_name = models.CharField(max_length=200, blank=True, null=True)
    customer_email = models.EmailField(blank=True, null=True)
    booking_time = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('screening', 'seat')
    
    def __str__(self):
        return f"Booking for {self.screening} - {self.seat}"
