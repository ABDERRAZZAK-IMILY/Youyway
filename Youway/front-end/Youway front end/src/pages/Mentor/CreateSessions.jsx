import React, { useState, useEffect } from 'react';
import { axiosClient } from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function SessionCreate() {
  const [form, setForm] = useState({
    mentor_id: null,
    start_time: '',
    end_time: '',
    call_link: "https://meet.jit.si/" + Math.random().toString(36),
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await axiosClient.get('/my-mentor');
        setForm(prevForm => ({
          ...prevForm,
          mentor_id: response.data.id
        }));
      } catch (error) {
        console.log("Mentor not found", error);
      }
    };

    fetchMentor();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.mentor_id) {
      console.log("Mentor ID not loaded yet.");
      return;
    }

    try {
      await axiosClient.post('/sessions', form);
      navigate('/mentor');
    } catch (error) {
      console.log('error created session:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Create New Session</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          className="bg-indigo-600  px-4 py-2 rounded hover:bg-indigo-700"
        >
          Create Session
        </button>
      </form>
    </div>
  );
}
