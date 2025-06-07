
import React, { useState, useEffect } from 'react';

interface Booking {
  id: number;
  student_email: string;
  teacher_username: string;
  status: string;
  created_at: string;
  student: {
    name: string;
    email: string;
  };
  teacher: {
    username: string;
    subject: string;
    qualification?: string;
    experience?: string;
    fee?: number;
    day?: string;
    start_time?: string;
    end_time?: string;
  };
}

const PendingSessions: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [decliningId, setDecliningId] = useState<number | null>(null);

  const studentEmail = typeof window !== 'undefined' ? localStorage.getItem('email') || '' : '';

  useEffect(() => {
    async function fetchBookings() {
      if (!studentEmail) {
        setError('Student email not found in localStorage.');
        setLoading(false);
        return;
      }
      try {
        setError(null);
        setLoading(true);

        const res = await fetch(`https://gurushish-8.onrender.com/bookings/student/${encodeURIComponent(studentEmail)}`);

        if (!res.ok) {
          setError(`Failed to fetch: ${res.status} ${res.statusText}`);
          setLoading(false);
          return;
        }

        const data: Booking[] = await res.json();
        console.log('Fetched bookings:', data);

        setBookings(data);
      } catch (e) {
        console.error(e);
        setError('Unexpected error occurred while fetching bookings.');
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [studentEmail]);

  const pendingBookings = bookings.filter(b => b.status.toLowerCase() === 'pending');

  const handleDecline = async (id: number) => {
    if (!window.confirm('Are you sure you want to decline this booking?')) return;

    setDecliningId(id);  // To show loading on button
    try {
      const res = await fetch(`https://gurushish-8.onrender.com/bookings/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errMsg = await res.text();
        alert(`Failed to decline booking: ${res.status} ${res.statusText} - ${errMsg}`);
        setDecliningId(null);
        return;
      }

      // Remove declined booking from the state
      setBookings((prev) => prev.filter((booking) => booking.id !== id));
      setDecliningId(null);
    } catch (error) {
      console.error('Error declining booking:', error);
      alert('Error declining booking. Please try again.');
      setDecliningId(null);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Pending Sessions</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600 font-bold">{error}</p>}

      {!loading && !error && pendingBookings.length === 0 && (
        <p>No pending sessions found.</p>
      )}

      {!loading && !error && pendingBookings.length > 0 && (
        <div className="space-y-4">
          {pendingBookings.map((b) => (
            <div key={b.id} className="border p-4 rounded shadow bg-yellow-50">
              <p><strong>Student Name:</strong> {b.student?.name || 'N/A'}</p>
              <p><strong>Student Email:</strong> {b.student?.email || 'N/A'}</p>

              <p><strong>Teacher Username:</strong> {b.teacher?.username || 'N/A'}</p>
              <p><strong>Subject:</strong> {b.teacher?.subject || 'N/A'}</p>
              <p><strong>Qualification:</strong> {b.teacher?.qualification || 'N/A'}</p>
              <p><strong>Experience:</strong> {b.teacher?.experience || 'N/A'}</p>
              <p><strong>Fee:</strong> {b.teacher?.fee !== undefined ? b.teacher.fee : 'N/A'}</p>
              <p><strong>Day:</strong> {b.teacher?.day || 'N/A'}</p>
              <p><strong>Time:</strong> {b.teacher?.start_time || 'N/A'} - {b.teacher?.end_time || 'N/A'}</p>

              <p><strong>Status:</strong> {b.status}</p>

              <button
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                onClick={() => handleDecline(b.id)}
                disabled={decliningId === b.id}
              >
                {decliningId === b.id ? 'Declining...' : 'Decline'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingSessions;
