import React, { useState, useEffect } from 'react';
import { axiosClient } from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';


export default function SessionCreate() {
  const { mentorId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const studentId =  jwtDecode(token).sub;

  console.log(studentId);
  

  const [form, setForm] = useState({
    mentor_id: mentorId,
    student_id: studentId,
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    call_link: 'https://meet.jit.si/' + Math.random().toString(36),
  });

  const [errors, setErrors] = useState({});



  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.mentor_id || !form.student_id) {
      console.error("Missing mentor_id or student_id");
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) {
        data.append(key, value);
      }
    });

    try {
      await axiosClient.post('/sessions', data);
      navigate('/mentor');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        console.error('Validation errors:', err.response.data.errors);
      } else {
        console.error('Error creating session:', err);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Create New Session</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">

        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
          {errors.title && <p className="text-red-500">{errors.title[0]}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.description && <p className="text-red-500">{errors.description[0]}</p>}
        </div>

        {/* Start Time */}
        <div>
          <label className="block mb-1 font-medium">Start Time</label>
          <input
            type="datetime-local"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
          {errors.start_time && <p className="text-red-500">{errors.start_time[0]}</p>}
        </div>

        {/* End Time */}
        <div>
          <label className="block mb-1 font-medium">End Time</label>
          <input
            type="datetime-local"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
          {errors.end_time && <p className="text-red-500">{errors.end_time[0]}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Create Session
        </button>

      </form>
    </div>
  );
}
