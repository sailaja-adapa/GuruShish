
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Teacher {
  id: number;
  username: string;
  subject: string;
  qualification?: string;
  experience?: string;
  fee?: number;
  day?: string;
  start_time?: string;
  end_time?: string;
}

interface TeacherProfile {
  username: string;
  name: string;
  email: string;
  phone: string;
  education: string;
  experience: string;
  location: string;
  subjects: string;
  max_students: number | null;
  degree_certificate_path: string;
}

interface Session {
  id: number;
  studentName: string;
  studentEmail: string;
  teacherUsername: string;
  subject: string;
  qualification?: string;
  experience?: string;
  fee?: number;
  day: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed';
}

export default function StudentPage() {
  const router = useRouter();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<TeacherProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [view, setView] = useState<'teachers' | 'confirmed'>('teachers');
  const [bookedTeacherIds, setBookedTeacherIds] = useState<Set<number>>(new Set());
  const [sessions, setSessions] = useState<Session[]>([]);

  const studentUsername = typeof window !== 'undefined' ? localStorage.getItem('username') || '' : '';
  const studentEmail = typeof window !== 'undefined' ? localStorage.getItem('email') || '' : '';

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const res = await fetch('https://gurushish-8.onrender.com/teacher');
        const data = await res.json();
        setTeachers(data);
      } catch (err) {
        console.error('Failed to fetch teachers', err);
      }
    }

    async function fetchSessions() {
      if (!studentUsername) return;
      try {
        const res = await fetch(`https://gurushish-8.onrender.com/bookings/student/${studentUsername}`);
        const data = await res.json();
        setSessions(data);
      } catch (err) {
        console.error('Failed to fetch sessions', err);
      }
    }

    fetchTeachers();
    fetchSessions();
  }, [studentUsername]);

  const handleViewProfile = async (username: string) => {
    setLoadingProfile(true);
    try {
      const res = await fetch(`https://gurushish-8.onrender.com/teacher-profiles/username/${username}`);
      const data = await res.json();
      setSelectedProfile(data);
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleBookNow = async (teacher: Teacher) => {
    if (bookedTeacherIds.has(teacher.id)) return;

    setBookedTeacherIds((prev) => new Set(prev).add(teacher.id));

    try {
      const bookingData = {
        studentEmail,
        teacherUsername: teacher.username,
        subject: teacher.subject,
        qualification: teacher.qualification,
        experience: teacher.experience,
        fee: teacher.fee,
        day: teacher.day || '',
        start_time: teacher.start_time || '',
        end_time: teacher.end_time || '',
      };

      const res = await fetch('https://gurushish-8.onrender.com/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const updated = await res.json();
      setSessions((prev) => [...prev, updated]);
    } catch (err) {
      console.error('Failed to book session', err);
      setBookedTeacherIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(teacher.id);
        return newSet;
      });
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.username.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      (t.qualification?.toLowerCase().includes(q) ?? false)
    );
  });

  const confirmedSessions = sessions.filter((s) => s.status === 'confirmed');

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-[#001f3f] text-white py-6 px-4 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">GuruShish</h1>
        <input
          type="text"
          placeholder="Search Teachers, Subjects, Qualifications..."
          className="py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#001f3f] text-black w-full sm:w-auto"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-3">
          <button
            className="px-4 py-2 rounded-lg font-semibold bg-yellow-500 text-white hover:bg-yellow-600"
            onClick={() => router.push('/pending')}
          >
            Pending Sessions
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${
              view === 'confirmed' ? 'bg-green-600 text-white' : 'bg-white text-[#001f3f] hover:bg-green-500'
            }`}
            onClick={() => setView('confirmed')}
          >
            Confirmed Sessions
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${
              view === 'teachers' ? 'bg-[#001f3f] text-white' : 'bg-white text-[#001f3f] hover:bg-gray-300'
            }`}
            onClick={() => setView('teachers')}
          >
            Slots
          </button>
        </div>
      </header>

      <main className="flex-grow py-10 px-4 max-w-7xl mx-auto">
        {view === 'teachers' && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Find Your Perfect Teacher</h2>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTeachers.map((teacher) => (
                <div key={teacher.id} className="bg-white rounded-xl shadow p-6 border">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{teacher.username}</h3>
                    <p>Subject: <span className="font-medium">{teacher.subject}</span></p>
                    <p>Qualification: {teacher.qualification || 'N/A'}</p>
                    <p>Experience: {teacher.experience || 'N/A'}</p>
                    <p>Fee: ₹{teacher.fee || 0}</p>
                    <p>Day: {teacher.day || 'N/A'}</p>
                    <p>Time: {teacher.start_time} - {teacher.end_time}</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <button
                      className="w-full bg-[#001f3f] text-white py-2 rounded hover:bg-blue-800"
                      onClick={() => handleViewProfile(teacher.username)}
                    >
                      View Profile
                    </button>
                    <button
                      className={`w-full py-2 rounded ${
                        bookedTeacherIds.has(teacher.id)
                          ? 'bg-yellow-500 text-white cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                      disabled={bookedTeacherIds.has(teacher.id)}
                      onClick={() => handleBookNow(teacher)}
                    >
                      {bookedTeacherIds.has(teacher.id) ? 'Waiting for Confirmation' : 'Book Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {view === 'confirmed' && (
          <>
            <h2 className="text-2xl font-semibold text-green-700 mb-6">Confirmed Sessions</h2>
            {confirmedSessions.length === 0 ? (
              <p className="text-gray-600">You have no confirmed sessions.</p>
            ) : (
              <div className="space-y-4">
                {confirmedSessions.map((s) => (
                  <div key={s.id} className="bg-green-100 p-4 rounded shadow">
                    <p><strong>Teacher:</strong> {s.teacherUsername}</p>
                    <p><strong>Subject:</strong> {s.subject}</p>
                    <p><strong>Time:</strong> {s.day} | {s.start_time} - {s.end_time}</p>
                    <p className="text-green-700 font-semibold">Status: Confirmed</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal for profile */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-2 right-3 text-gray-700 text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedProfile.username}'s Profile</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedProfile.name}</p>
              <p><strong>Email:</strong> {selectedProfile.email}</p>
              <p><strong>Phone:</strong> {selectedProfile.phone}</p>
              <p><strong>Education:</strong> {selectedProfile.education}</p>
              <p><strong>Experience:</strong> {selectedProfile.experience}</p>
              <p><strong>Location:</strong> {selectedProfile.location}</p>
              <p><strong>Subjects:</strong> {selectedProfile.subjects}</p>
              <p><strong>Max Students:</strong> {selectedProfile.max_students ?? 'N/A'}</p>
              {selectedProfile.degree_certificate_path && (
                <img
                  src={`https://gurushish-8.onrender.com/${selectedProfile.degree_certificate_path.replace(/\\/g, '/')}`}
                  alt="Degree Certificate"
                  className="w-full mt-2 rounded"
                />
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="bg-[#001f3f] text-white py-4 text-center">
        <p>&copy; 2025 GuruShish. All rights reserved.</p>
      </footer>
    </div>
  );
}
