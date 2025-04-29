import React, { useState, useEffect } from 'react';
import { axiosClient } from '../../api/axios';
import { useNavigate } from 'react-router-dom';


export default function SessionCreate() {

  const MentoreId = localStorage.getItem("userId");

  console.log(MentoreId);

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    mentor_id : MentoreId,
    student_id : '',
    start_time: '',
    end_time: '',
    call_link : "https://meet.jit.si/" + Math.random().toString(36).substring(2, 15),
  });

  console.log(form);
  const navigate = useNavigate();

   
  const fetchStudents = async () => {
    try {
      const studentsRes = await axiosClient.get('/students');

      setStudents(studentsRes.data);
      console.log(studentsRes.data);
    } catch {
      console.log('error fetching data:');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.post('/sessions', form);
      navigate('/mentor');
    } catch {
      console.log('error created session:');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Create New Session</h2>


      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Student</label>
          <select
            name="student_id"
            value={form.student_id}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          >
            <option value="">Select a Student</option>
            {students.map((student) => (
              <option  className="text-gray-800" key={student.id} value={student.id}>
                {student.user?.name}
              </option>
            ))}
          </select>
        </div>

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
