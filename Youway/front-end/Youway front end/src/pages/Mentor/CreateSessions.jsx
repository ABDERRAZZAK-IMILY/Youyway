import React, { useState, useEffect } from 'react';
import { axiosClient } from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function SessionCreate() {
  const [form, setForm] = useState({
    mentor_id: null,
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    call_link: 'https://meet.jit.si/' + Math.random().toString(36),
    image: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  useEffect(() => {
    axiosClient.get('/my-mentor')
      .then(res => setForm(prev => ({ ...prev, mentor_id: res.data.id })))
      .catch(err => console.error('Mentor not found', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.mentor_id) return;

    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));

    try {
      // Let Axios set the correct multipart headers (including boundary)
      await axiosClient.post('/sessions', data);
      navigate('/mentor');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
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
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-1 font-medium">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        {/* Start & End Time */}
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
        </div>
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
        </div>

        <button
          type="submit"
          className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700"
        >
          Create Session
        </button>
      </form>
    </div>
  );
}
