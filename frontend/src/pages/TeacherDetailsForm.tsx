'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

type FormState = {
  username: string;
  subject: string;
  qualification: string;
  experience: string;
  fee: string;
  day: string;
  start_time: string;
  end_time: string;
};

export default function TeacherDetailsForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<FormState>({
    username: '',
    subject: '',
    qualification: '',
    experience: '',
    fee: '',
    day: '',
    start_time: '',
    end_time: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const isFormValid = () => {
    const { username, subject, qualification, experience, fee, day, start_time, end_time } = form;
    if (!username || !subject || !qualification || !experience || !fee || !day || !start_time || !end_time) {
      toast.error('Please fill in all fields.');
      return false;
    }

    if (isNaN(Number(fee)) || Number(fee) <= 0) {
      toast.error('Fee must be a valid positive number.');
      return false;
    }

    if (start_time >= end_time) {
      toast.error('Start time must be earlier than end time.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) return;

    setIsSubmitting(true);
    try {
      const payload = {
  username: form.username,
  subject: form.subject,
  qualification: form.qualification,
  experience: form.experience,
  fee: Number(form.fee),
  day: form.day,
  start_time: form.start_time,
  end_time: form.end_time,
};


      const res = await fetch('https://gurushish-8.onrender.com/teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        toast.success('Details submitted successfully!');
        setTimeout(() => router.push('/TeacherDetailsPage'), 1000);
      } else {
        const errorData = await res.json();
        toast.error(`Error: ${errorData.message || 'Failed to submit details'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An error occurred while submitting the form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white mt-10 shadow-lg rounded-xl">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Enter Teaching Details</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField label="User Name" name="username" value={form.username} onChange={handleChange} />
        <InputField label="Subject" name="subject" value={form.subject} onChange={handleChange} />
        <InputField label="Highest Qualification" name="qualification" value={form.qualification} onChange={handleChange} />
        <InputField label="Teaching Experience" name="experience" value={form.experience} onChange={handleChange} />
        <InputField label="Fee per Session (INR)" name="fee" value={form.fee} onChange={handleChange} />

        <div>
          <label className="font-semibold mb-2 block">Available Slot</label>
          <div className="flex flex-wrap gap-2 mb-3 items-center">
            <select
              name="day"
              value={form.day}
              onChange={handleChange}
              className="flex-1 border rounded p-2 min-w-[120px]"
              required
            >
              <option value="">Select Day</option>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <input
              type="time"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
              className="flex-1 border rounded p-2 min-w-[100px]"
              required
            />
            <input
              type="time"
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
              className="flex-1 border rounded p-2 min-w-[100px]"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-6 py-2 rounded transition ${
            isSubmitting ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800 text-white'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Details'}
        </button>
      </form>
    </div>
  );
}

type InputProps = {
  label: string;
  name: keyof FormState;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

function InputField({ label, name, value, onChange }: InputProps) {
  return (
    <div>
      <label className="block font-semibold mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded p-2"
        required
      />
    </div>
  );
}
