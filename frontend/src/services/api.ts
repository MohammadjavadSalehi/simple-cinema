import axios from "axios";

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
});

export interface Room {
  id: number;
  name: string;
  capacity: number;
  color: string | null;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  poster: string | null;
  duration: number;
}

export interface Screening {
  id: number;
  movie: number;
  room: number;
  start_time: string;
  movie_title?: string;
  room_name?: string;
}

export interface Seat {
  id: number;
  row: string;
  number: number;
  is_booked?: boolean;
}

export interface Booking {
  id?: number;
  screening: number;
  seat: number;
  customer_name?: string;
  customer_email?: string;
  booking_time?: string;
}

// Room API
export const getRooms = async (): Promise<Room[]> => {
  try {
    const response = await api.get("/rooms/");
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }
};

export const getRoomById = async (id: number): Promise<Room> => {
  const response = await api.get(`/rooms/${id}/`);
  return response.data;
};

// Movie API
export const getMovies = async (): Promise<Movie[]> => {
  try {
    const response = await api.get("/movies/");
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

export const getMovieById = async (id: number): Promise<Movie> => {
  const response = await api.get(`/movies/${id}/`);
  return response.data;
};

// Screening API
export const getScreeningsByRoom = async (
  roomId: number
): Promise<Screening[]> => {
  const response = await api.get(`/room/${roomId}/screenings/`);
  return response.data;
};

export const getScreeningById = async (id: number): Promise<Screening> => {
  const response = await api.get(`/screenings/${id}/`);
  return response.data;
};

// Seat API
export const getSeatsByScreening = async (
  screeningId: number
): Promise<Seat[]> => {
  const response = await api.get(`/screenings/${screeningId}/seats/`);
  return response.data;
};

// Booking API
export const createBooking = async (booking: Booking): Promise<Booking> => {
  const response = await api.post("/bookings/", booking);
  return response.data;
};
