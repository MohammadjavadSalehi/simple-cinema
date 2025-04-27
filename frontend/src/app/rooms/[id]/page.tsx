'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getRoomById, getScreeningsByRoom, Room, Screening } from '@/services/api';

export default function RoomPage() {
    const params = useParams();
    const roomId = Number(params.id);

    const [room, setRoom] = useState<Room | null>(null);
    const [screenings, setScreenings] = useState<Screening[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Mark that we're now client-side
        setIsClient(true);

        const fetchRoomAndScreenings = async () => {
            try {
                const [roomData, screeningsData] = await Promise.all([
                    getRoomById(roomId),
                    getScreeningsByRoom(roomId)
                ]);

                setRoom(roomData);
                setScreenings(screeningsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError('Failed to load room data. Please try again later.');
                setLoading(false);
            }
        };

        if (roomId) {
            fetchRoomAndScreenings();
        }
    }, [roomId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        }).format(date);
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    };

    // Only show content when we're in the client to avoid hydration mismatch
    if (!isClient) {
        return null;
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

    if (!room) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-red-500">Room not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8">
            <header className="mb-8">
                <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
                    ← Back to all rooms
                </Link>
                <h1 className="text-3xl font-bold" style={{ color: room.color || 'inherit' }}>
                    {room.name} Room
                </h1>
                <p className="text-gray-600">Capacity: {room.capacity} seats</p>
            </header>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Available Movies</h2>

                {screenings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {screenings.map((screening) => (
                            <Link
                                key={screening.id}
                                href={`/screenings/${screening.id}`}
                                className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                            >
                                <h3 className="text-xl font-semibold mb-2">{screening.movie_title}</h3>
                                <div className="text-gray-600 mb-4">
                                    <p>{formatDate(screening.start_time)}</p>
                                    <p>{formatTime(screening.start_time)}</p>
                                </div>
                                <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
                                    View Seats
                                </button>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-lg text-gray-500">No screenings scheduled for this room at the moment.</p>
                )}
            </div>
        </div>
    );
} 