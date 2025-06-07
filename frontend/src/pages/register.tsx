
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../app/components/Header';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserTag } from 'react-icons/fa';

const Register = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const res = await fetch('https://gurushish-8.onrender.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
        }),
      });

      if (res.ok) {
        alert('User registered successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          role: 'student',
        });

        // Redirect based on role
        if (formData.role === 'teacher') {
          router.push('/TeacherRegistration');
        }
      } else {
        const errorData = await res.json();
        alert('Registration failed: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              icon={<FaUser />}
              label="Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />
            <InputField
              icon={<FaEnvelope />}
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              icon={<FaPhone />}
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />
            <InputField
              icon={<FaLock />}
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            <InputField
              icon={<FaLock />}
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <div>
              <label className="block font-medium mb-1 text-blue-900">Register as</label>
              <div className="flex items-center border border-gray-300 rounded px-3">
                <FaUserTag className="text-gray-500 mr-2" />
                <select
                  name="role"
                  className="w-full p-2 outline-none bg-transparent"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

const InputField = ({
  icon,
  label,
  name,
  type,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <label htmlFor={name} className="block font-medium mb-1 text-blue-900">
      {label}
    </label>
    <div className="flex items-center border border-gray-300 rounded px-3">
      <div className="text-gray-500 mr-2">{icon}</div>
      <input
        id={name}
        name={name}
        type={type}
        required
        className="w-full p-2 outline-none"
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

export default Register;
