'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getScreeningById, getSeatsByScreening, createBooking, Screening, Seat } from '@/services/api';

export default function ScreeningPage() {
    const params = useParams();
    const screeningId = Number(params.id);

    const [screening, setScreening] = useState<Screening | null>(null);
    const [seats, setSeats] = useState<Seat[]>([]);
    const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [bookingInProgress, setBookingInProgress] = useState(false);
    const [bookingStatus, setBookingStatus] = useState<{ success?: boolean; message?: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Mark that we're now client-side
        setIsClient(true);

        const fetchScreeningAndSeats = async () => {
            try {
                const [screeningData, seatsData] = await Promise.all([
                    getScreeningById(screeningId),
                    getSeatsByScreening(screeningId)
                ]);

                setScreening(screeningData);
                setSeats(seatsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching screening data:", error);
                setError('Failed to load screening data. Please try again later.');
                setLoading(false);
            }
        };

        if (screeningId) {
            fetchScreeningAndSeats();
        }
    }, [screeningId]);

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    };

    const handleSeatSelect = (seat: Seat) => {
        if (seat.is_booked) return;
        setSelectedSeat(seat);
        setBookingStatus(null);
    };

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedSeat) return;

        setBookingInProgress(true);
        setBookingStatus(null);

        try {
            await createBooking({
                screening: screeningId,
                seat: selectedSeat.id,
                customer_name: customerName,
                customer_email: customerEmail
            });

            // Update local seat status
            setSeats(seats.map(seat =>
                seat.id === selectedSeat.id
                    ? { ...seat, is_booked: true }
                    : seat
            ));

            setSelectedSeat(null);
            setCustomerName('');
            setCustomerEmail('');
            setBookingStatus({
                success: true,
                message: 'Your seat has been successfully booked!'
            });
        } catch (err) {
            console.error("Booking error:", err);
            setBookingStatus({
                success: false,
                message: 'Failed to book the seat. It might already be taken.'
            });
        } finally {
            setBookingInProgress(false);
        }
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

    if (!screening) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-red-500">Screening not found</p>
            </div>
        );
    }

    // Group seats by row
    const seatsByRow = seats.reduce((acc: Record<string, Seat[]>, seat) => {
        if (!acc[seat.row]) {
            acc[seat.row] = [];
        }
        acc[seat.row].push(seat);
        return acc;
    }, {});

    // Sort rows alphabetically
    const sortedRows = Object.keys(seatsByRow).sort();

    return (
        <div className="min-h-screen p-8">
            <header className="mb-8">
                <Link href={`/rooms/${screening.room}`} className="text-blue-600 hover:underline mb-4 inline-block">
                    ← Back to room
                </Link>
                <h1 className="text-3xl font-bold mb-1">{screening.movie_title}</h1>
                <p className="text-gray-600 mb-2">
                    {screening.room_name} Room • {formatDateTime(screening.start_time)}
                </p>
            </header>

            <div className="mb-8 max-w-6xl mx-auto">
                <div className="bg-gray-900 p-4 rounded-t-lg text-center text-white mb-8">
                    <p className="text-sm font-semibold">SCREEN</p>
                </div>

                <div className="mb-8">
                    {sortedRows.map(rowName => (
                        <div key={rowName} className="flex justify-center mb-4">
                            <div className="w-10 flex items-center justify-center font-semibold">
                                {rowName}
                            </div>
                            <div className="flex gap-2 flex-wrap justify-center">
                                {seatsByRow[rowName]
                                    .sort((a, b) => a.number - b.number)
                                    .map(seat => (
                                        <button
                                            key={seat.id}
                                            onClick={() => handleSeatSelect(seat)}
                                            disabled={seat.is_booked}
                                            className={`
                        w-10 h-10 rounded flex items-center justify-center text-sm font-medium
                        ${seat.is_booked
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : selectedSeat?.id === seat.id
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white border border-gray-300 hover:border-blue-500'
                                                }
                      `}
                                        >
                                            {seat.number}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center gap-6 mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white border border-gray-300"></div>
                        <span className="text-sm">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-600"></div>
                        <span className="text-sm">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-300"></div>
                        <span className="text-sm">Booked</span>
                    </div>
                </div>

                {selectedSeat && (
                    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-xl font-semibold mb-4">Book your seat</h3>
                        <p className="mb-4">
                            You are booking seat {selectedSeat.row}-{selectedSeat.number}
                        </p>

                        {bookingStatus && (
                            <div className={`mb-4 p-3 rounded ${bookingStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {bookingStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleBooking}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={bookingInProgress}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1"
                                >
                                    {bookingInProgress ? 'Booking...' : 'Confirm Booking'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedSeat(null)}
                                    className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
} 