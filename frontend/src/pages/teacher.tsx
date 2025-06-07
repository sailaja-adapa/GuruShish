
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type Profile = {
  username: string;
  name: string;
  email: string;
  phone: string;
  education: string;
  experience: string;
  location: string;
  subjects: string; // comma-separated string
  maxStudents: string;
};

export default function TeacherDashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'confirmed' | 'pending'>('profile');

  const [profile, setProfile] = useState<Profile>({
    username: '',
    name: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    location: '',
    subjects: '',
    maxStudents: '',
  });

  const [degreeCertificate, setDegreeCertificate] = useState<File | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDegreeCertificate(e.target.files[0]);
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append('username', profile.username);
    formData.append('name', profile.name);
    formData.append('email', profile.email);
    formData.append('phone', profile.phone);
    formData.append('education', profile.education);
    formData.append('experience', profile.experience);
    formData.append('location', profile.location);
    formData.append('subjects', profile.subjects);
    formData.append('maxStudents', profile.maxStudents);

    if (degreeCertificate) {
      formData.append('degreeCertificate', degreeCertificate);
    }

    const response = await fetch('https://gurushish-8.onrender.com/teacher-profiles', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to save profile');
    }

    const result = await response.json();
    alert('Profile saved successfully!');
    console.log('Saved profile:', result);
  } catch (error) {
    console.error('Error saving profile:', error);
    alert('Failed to save profile');
  }
};


  const handleReset = () => {
    setProfile({
      username: '',
      name: '',
      email: '',
      phone: '',
      education: '',
      experience: '',
      location: '',
      subjects: '',
      maxStudents: '',
    });
    setDegreeCertificate(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8">
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Teacher Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 capitalize">Username</label>
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Name, Email, Phone, Location */}
              {['name', 'email', 'phone', 'location'].map((field) => (
                <div key={field}>
                  <label className="block text-gray-700 font-medium mb-1 capitalize">{field}</label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={(profile as any)[field]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}

              {/* Education */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Education</label>
                <textarea
                  name="education"
                  value={profile.education}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Experience</label>
                <textarea
                  name="experience"
                  value={profile.experience}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Subjects */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Subjects You Teach <span className="text-sm text-gray-500">(comma separated)</span>
                </label>
                <input
                  type="text"
                  name="subjects"
                  value={profile.subjects}
                  onChange={handleChange}
                  placeholder="e.g., Maths, English, Physics"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Max Students */}
              <div className="mb-6">
                <label htmlFor="maxStudents" className="block text-gray-700 font-medium mb-2">
                  Max Number of Students You Can Teach
                </label>
                <select
                  id="maxStudents"
                  name="maxStudents"
                  value={profile.maxStudents}
                  onChange={(e) => setProfile({ ...profile, maxStudents: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>
                    Select number of students
                  </option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i + 1 === 1 ? 'student' : 'students'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Degree Certificate Upload */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Upload Degree Certificate (PDF or Image)</label>
                <div className="flex items-center space-x-4 border-2 border-black rounded-md p-2">
                  <label
                    htmlFor="degreeCertificate"
                    className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Choose File
                  </label>
                  <input
                    id="degreeCertificate"
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleCertificateChange}
                    className="hidden"
                    required={!degreeCertificate}
                  />
                  {degreeCertificate ? (
                    <span className="text-gray-800 truncate max-w-xs" title={degreeCertificate.name}>
                      {degreeCertificate.name}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">No file selected</span>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-red-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-600 transition"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'confirmed' && (
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">Confirmed Sessions</h2>
            <p className="text-gray-600">No confirmed sessions yet.</p>
            {/* TODO: Load confirmed sessions */}
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-600">Pending Sessions</h2>
            <p className="text-gray-600">No pending sessions yet.</p>
            {/* TODO: Load pending sessions */}
          </div>
        )}
      </main>

      <aside className="w-64 bg-white p-6 border-l border-gray-200 flex flex-col space-y-4 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-center text-blue-800">Dashboard</h3>
        <Link href="/TeacherDetailsForm">
          <button className="py-2 rounded-md text-left font-semibold px-4 w-full bg-gray-100 text-gray-800 hover:bg-blue-600 hover:text-white transition">
            Create Slots
          </button>
        </Link>

        <button
          onClick={() => setActiveTab('confirmed')}
          className={`py-2 rounded-md text-left font-semibold px-4 ${
            activeTab === 'confirmed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-blue-600 hover:text-white'
          } transition`}
        >
          Confirmed Sessions
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`py-2 rounded-md text-left font-semibold px-4 ${
            activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-blue-600 hover:text-white'
          } transition`}
        >
          Pending Sessions
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`py-2 rounded-md text-left font-semibold px-4 ${
            activeTab === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-blue-600 hover:text-white'
          } transition`}
        >
          Profile
        </button>
      </aside>
    </div>
  );
}
