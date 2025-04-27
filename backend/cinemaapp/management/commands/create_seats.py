from django.core.management.base import BaseCommand
from cinemaapp.models import Room, Seat

class Command(BaseCommand):
    help = 'Create seats for cinema rooms'
    
    def add_arguments(self, parser):
        parser.add_argument('--room_id', type=int, help='ID of the room to create seats for')
        parser.add_argument('--rows', type=int, default=8, help='Number of rows')
        parser.add_argument('--seats_per_row', type=int, default=10, help='Number of seats per row')
    
    def handle(self, *args, **options):
        room_id = options.get('room_id')
        rows = options.get('rows')
        seats_per_row = options.get('seats_per_row')
        
        # Get all rooms or specific room
        if room_id:
            rooms = Room.objects.filter(id=room_id)
            if not rooms.exists():
                self.stdout.write(self.style.ERROR(f'Room with ID {room_id} does not exist'))
                return
        else:
            rooms = Room.objects.all()
            if not rooms.exists():
                self.stdout.write(self.style.ERROR('No rooms found. Please create rooms first.'))
                return
        
        for room in rooms:
            # Check if room already has seats
            existing_seats = Seat.objects.filter(room=room).count()
            if existing_seats > 0:
                self.stdout.write(
                    self.style.WARNING(f'Room "{room.name}" already has {existing_seats} seats. Skipping.')
                )
                continue
            
            # Create seats for the room
            seats_created = 0
            for row in range(1, rows + 1):
                row_letter = chr(64 + row)  # A, B, C, ...
                for seat_num in range(1, seats_per_row + 1):
                    Seat.objects.create(
                        room=room,
                        row=row_letter,
                        number=seat_num
                    )
                    seats_created += 1
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created {seats_created} seats for room "{room.name}"')
            ) 