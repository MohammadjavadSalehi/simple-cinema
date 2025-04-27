 # Cinema Booking Application

A cinema booking application with Next.js frontend and Django backend. This application allows users to:

1. Browse different cinema rooms
2. View available movies in each room
3. Select a screening and book a seat

## Features

- **Room Management**: Create and manage cinema rooms with different capacities and colors
- **Movie Management**: Add movies with titles, descriptions, and posters
- **Screening Schedule**: Schedule movie screenings in different rooms
- **Seat Booking**: Interactive seat booking system with real-time availability
- **Admin Panel**: Complete CRUD operations for all entities via Django admin

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Django 5, Django REST Framework
- **Database**: SQLite (default, can be replaced with PostgreSQL)

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Create and activate a virtual environment:

   ```
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate  # Linux/Mac
   ```

3. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

4. Run migrations:

   ```
   python manage.py migrate
   ```

5. Create a superuser for the admin panel:

   ```
   python manage.py createsuperuser
   ```

6. Create seats for rooms (after adding rooms via admin panel):

   ```
   python manage.py create_seats
   ```

7. Start the backend server:
   ```
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. Access the application at http://localhost:3000
2. Access the admin panel at http://localhost:8000/admin

## Admin Usage

1. Login to the admin panel
2. Create rooms with different capacities
3. Add movies with titles and durations
4. Schedule screenings by assigning movies to rooms at specific times
5. Run the seat creation command if you haven't already
