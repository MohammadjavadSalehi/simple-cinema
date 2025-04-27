'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRooms, Room } from '../services/api';

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're now client-side
    setIsClient(true);

    const fetchRooms = async () => {
      try {
        const fetchedRooms = await getRooms();
        setRooms(fetchedRooms);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError('Failed to load rooms. Please try again later.');
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Only show content when we're in the client to avoid hydration mismatch
  if (!isClient) {
    return null; // Or a simple loading skeleton that's identical on server and client
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">Cinema App</h1>
        <p className="text-lg text-gray-600">Choose a cinema room to view available movies</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <Link
              key={room.id}
              href={`/rooms/${room.id}`}
              className="block p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white border border-gray-200"
              style={{ borderLeft: room.color ? `6px solid ${room.color}` : undefined }}
            >
              <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
              <p className="text-gray-600">Capacity: {room.capacity} seats</p>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center">
            <p className="text-lg text-gray-500">No cinema rooms available. Please come back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
